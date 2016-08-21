import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Input from '../input.jsx';

import 'expose?$!expose?jQuery!jquery';
// import 'font-awesome/css/font-awesome.min.css';
// import 'bootstrap-webpack';

storiesOf('Input', module)
    .add('Required & not required', () => (
        <div>
            <Input required={true} onChange={action('Change name 1')}>Name 1</Input>
            <Input required={false} onChange={action('Change name 2')}>Name 2</Input>
        </div>
    ))
    .add('Child vs no child', () => (
        <div>
            <Input required={true} message="Custom error message" onChange={action('Change name 1')}>Name 1</Input>
            <Input required={false} title="Name 2" name="email" onChange={action('Change name 2')}></Input>
        </div>
    ));