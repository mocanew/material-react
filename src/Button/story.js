import React from 'react';
import { storiesOf, action } from '@storybook/react';
import { withKnobs, boolean, select } from '@storybook/addon-knobs';
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

class StressTest extends React.Component {
    constructor() {
        super();
        this.state = {
            i: 1
        };
    }
    componentWillMount() {
        this.interval = setInterval(() => {
            this.setState({
                i: this.state.i + 1
            });
        }, 5000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render() {
        if (this.state.i % 2 == 0) {
            return (<div />);
        }

        return (
            <div>
                <Button raised>Ripple button(default)</Button>
            </div>
        );
    }
}
stories.add('Unmount cleanup test', () => <StressTest />);
