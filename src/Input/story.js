import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Input from './index.jsx';
import Button from '../Button';

import '../_story.scss';

function randomString() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 50; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function usernameValidator(input, options) {
    var ret = {
        message: 'Accepted symbols are letters, numbers and -._',
        error: false
    };

    // on the first render, the input is undefined
    if (typeof input != 'string') {
        return ret;
    }

    if (options.canTrim) {
        if (input != input.trim()) {
            ret.value = input.trim();
        }
        input = input.trim();
    }

    if (!input.length && options.required) {
        ret.message = 'We don\'t accept empty usernames!';
        ret.error = true;
    }
    else if (!input.match(/^[a-zA-Z0-9-_.]+$/g)) {
        ret.message = 'Accepted symbols are letters, numbers and -._';
        ret.error = true;
    }
    return ret;
}

storiesOf('Input', module)
    .add('Required & not required', () => (
        <div>
            <Input placeholder="Name 1" name="name-1" title="Some helpful info" required={true} onChange={action('onChange 1')} onInput={action('onInput 1')} />
            <Input placeholder="Name 2" name="name-2" title="Some helpful info" required={false} onChange={action('Change name 2')} />
        </div>
    ))
    .add('Multiline', () => (
        <div>
            <Input multiline={true} required={true} onChange={action('Change name 1')} placeholder="Name 1" value={`Name 1 \ntest`} />
            <Input multiline={true} required={false} onChange={action('Change name 2')} placeholder="Name 2" value="Name 2 <br>" />
        </div>
    ))
    .add('Tab index', () => (
        <div>
            <Input placeholder="Field 1" tabIndex="1" />
            <Input placeholder="Field 2" tabIndex="3" />
            <Input placeholder="Field 3" tabIndex="2" />
        </div>
    ))
    .add('Custom validator', () => {
        var temp = {};
        var triggerError = () => {
            temp.input.setMessage('Custom error message (this could be received from a server)', true);
        };
        return (
            <div>
                <Input required placeholder="Username * (validated on blur)" validator={usernameValidator} />
                <Input required validateOnInput placeholder="Username * (validated on input)" validator={usernameValidator} ref={ref => temp.input = ref} />

                <Button raised onClick={triggerError}>Trigger error state</Button>
            </div>
        );
    })
    .add('Stress test (1.000 inputs)', () => {
        var list = [];
        for (var i = 0; i < 1000; i++) {
            list.push(<Input placeholder={`Name ${i}`} value={randomString()} required={true} onChange={action(`Change name ${i}`)} />);
        }
        return (
            <div>{list}</div>
        );
    });