import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Button from './index.jsx';

import '../_story.scss';

import $ from 'jquery';
window.$ = $;

storiesOf('Button', module)
    .add('Required & not required', () => (
        <div>
            <Button buttonStyle="flat">Flat button</Button>
            <br /><br />
            <Button buttonStyle="raised">Raised button</Button>
        </div>
    ));