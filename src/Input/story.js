import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Input from './index.jsx';

import '../_story.scss';

import $ from 'jquery';
window.$ = $;

storiesOf('Input', module)
    .add('Required & not required', () => (
        <div>
            <Input required={true} onChange={action('Change name 1') }>Name 1</Input>
            <Input required={false} onChange={action('Change name 2') }>Name 2</Input>
        </div>
    ));