import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import Checkbox from './index.jsx';

import '../_story.scss';

var stories = storiesOf('Checkbox', module);
stories.addDecorator(withKnobs);

stories.add('Knobs', () => {
    return (
        <div>
            <Checkbox ripple={boolean('Ripple', true)} disabled={boolean('Disabled', false)} onChange={action('Change')} />
        </div>
    );
});

stories.add('Many checkboxes', () => {
    var list = [];
    for (var i = 0; i < 1000; i++) {
        if (i % 2 == 0) {
            list.push(
                <Checkbox checked={!!(i % 2)} key={i * 3} />
            );
            list.push(<br key={i * 3 + 1} />);
            list.push(<br key={i * 3 + 2} />);
        }
    }
    return <div>{list}</div>;
});

