import React from 'react';
import { storiesOf, action } from '@storybook/react';
import Input from './index.jsx';

import '../_story.scss';

storiesOf('Input', module)
    .add('Required & not required', () => (
        <div>
            <Input required={true} onChange={action('Change name 1') }>Name 1</Input>
            <Input required={false} onChange={action('Change name 2') }>Name 2</Input>
        </div>
    ))
    .add('Multiline', () => (
        <div>
            <Input multiline={true} required={true} onChange={action('Change name 1') }>Name 1</Input>
            <Input multiline={true} required={false} onChange={action('Change name 2') }>Name 2</Input>
        </div>
    ));