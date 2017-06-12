import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from './index.jsx';

import '../_story.scss';

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

storiesOf('Button', module)
    .add('Flat & raised', () => (
        <div>
            <Button flat>Flat button</Button>
            <br /><br />
            <Button raised>Raised button</Button>
        </div>
    ))
    .add('Big button (multi-touch test)', () => (
        <div>
            <Button raised className="bigButton">BIG button</Button>
        </div>
    ))
    .add('Ripple & no ripple', () => (
        <div>
            <Button raised ripple={false}>No ripple button</Button>
            <br /><br />
            <Button raised>Ripple button(default)</Button>
        </div>
    ))
    .add('Unmount cleanup test', () => <StressTest />);