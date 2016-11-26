import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Button from './index.jsx';

import '../_story.scss';

storiesOf('Button', module)
    .add('Required & not required', () => (
        <div>
            <Button style="flat">Flat button</Button>
            <br /><br />
            <Button style="raised">Raised button</Button>
        </div>
    ));