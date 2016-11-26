import React from 'react';
import { storiesOf, action} from '@kadira/storybook';
import Select from './index.jsx';

import '../_story.scss';

var smallList = [
    {
        placeholder: true,
        text: 'Choose your country...'
    },
    'France',
    'Romania',
    'USA'
];
var longList = [
    {
        placeholder: true,
        text: 'Choose your country...'
    },
    'France',
    'Belgium',
    'Spain',
    'Portugal',
    'Hungary',
    'Romania',
    'Rusia',
    'USA'
];
var style = {
    minHeight: 'calc(100vh - 200px)',
    paddingLeft: 50,
    paddingTop: 200
};

storiesOf('Select', module)
    .add('Basic', () => (
        <div style={style}>
            <Select options={smallList} onChange={action('onChange') } inline={true} width={300} />
            <Select options={longList} onChange={action('onChange') } inline={true} width={300} />
        </div>
    ))
    .add('Required', () => (
        <div style={style}>
            <Select options={longList} onChange={action('onChange') } inline={true} width={300} required={true} />
        </div>
    ));