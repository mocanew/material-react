import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, select, number } from '@storybook/addon-knobs';
import Button from './index.jsx';

import '../_story.scss';

var stories = storiesOf('Button', module);
stories.addDecorator(withKnobs);

stories.add('Knobs', () => {
    var style = select('Style', {
        flat: 'Flat',
        raised: 'Raised',
        none: 'None'
    }, 'raised');

    return (
        <div>
            <Button onClick={action('On click')} ripple={boolean('Ripple', true)} disabled={boolean('Disabled', false)} flat={style == 'flat'} raised={style == 'raised'}>Button</Button>
        </div>
    );
});

stories.add('Flat & raised', () => (
    <div>
        <Button flat>Flat button</Button>
        <br /><br />
        <Button raised>Raised button</Button>
    </div>
));

stories.add('Icon button', () => (
    <div>
        <Button icon="play" raised></Button>
    </div>
));

class LoaderButtons extends React.Component {
    constructor() {
        super();

        this.state = {
            progress: 0
        };
        this.random = [Math.random(), Math.random(), Math.random(), Math.random()];

        this.updateProgress = this.updateProgress.bind(this);
    }
    updateProgress() {
        var knobValue = this.step;
        this.setState({
            progress: ((this.state.progress + knobValue) % 100 + (knobValue == 0 ? 0 : 1))
        });
    }
    componentWillUnmount() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }
    render() {
        this.step = number('Step', 5, {
            range: true,
            min: 0,
            max: 100,
            step: 0.1
        });
        this.speed = number('Update interval', 1000, {
            range: true,
            min: 0,
            max: 1000,
            step: 0.1
        });

        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(this.updateProgress, this.speed);

        return (
            <div className="spacing">
                <Button raised onClick={() => {
                    this.random = [Math.random(), Math.random(), Math.random(), Math.random()];
                    this.forceUpdate();
                }}>Refresh static progress</Button>
                <br />
                <Button loading={this.random[0]} flat>Loading</Button>
                <Button loading={this.random[1]} raised>Loading</Button>
                <Button loading flat>Loading</Button>
                <Button loading raised>Loading</Button>
                <br />
                <Button loading={this.random[2]} flat disabled>Loading</Button>
                <Button loading={this.random[3]} raised disabled>Loading</Button>
                <Button loading flat disabled>Loading</Button>
                <Button loading raised disabled>Loading</Button>
                <br />
                <Button loading={this.state.progress} flat>Progressing</Button>
            </div>
        );
    }
}
stories.add('Loader buttons', () => <LoaderButtons />);

stories.add('Big button (multi-touch test)', () => (
    <div>
        <Button raised className="bigButton">BIG button</Button>
    </div>
));

stories.add('Ripple & no ripple', () => (
    <div>
        <Button raised ripple={false}>No ripple button</Button>
        <br /><br />
        <Button raised>Ripple button(default)</Button>
    </div>
));

stories.add('Ripple link (drag&drop behaviour)', () => (
    <div>
        <a href="#"><Button raised>Ripple button</Button></a>
    </div>
));

class StressTest extends React.Component {
    constructor() {
        super();
        this.state = {
            i: 1
        };
    }
    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }
    componentWillReceiveProps(newProps) {
        if (this.interval) {
            clearInterval(this.interval);
        }

        this.interval = setInterval(() => {
            this.setState({
                i: (this.state.i + 1) % 2
            });
        }, newProps.interval);
    }
    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
    render() {
        if (this.state.i % 2 == 0) {
            return (<div />);
        }

        return (
            <div>
                <Button raised>Button</Button>
            </div>
        );
    }
}
stories.add('Unmount cleanup test', () => <StressTest interval={number('Frequency', 5000, {
    range: true,
    min: 100,
    max: 10000,
    step: 1
})} />);

stories.add('Many buttons', () => {
    var list = [];
    for (var i = 0; i < 100; i++) {
        if (i % 2 == 0) {
            list.push(
                <Button flat key={i * 3}>Flat button</Button>
            );
            list.push(<br key={i * 3 + 1} />);
            list.push(<br key={i * 3 + 2} />);
        }
        else {
            list.push(
                <Button raised key={i * 3}>Raised button</Button>
            );
            list.push(<br key={i * 3 + 1} />);
            list.push(<br key={i * 3 + 2} />);
        }
    }
    return <div>{list}</div>;
});
