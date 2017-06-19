import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import Select from './index.jsx';

import '../_story.scss';
import './_story.scss';

var stories = storiesOf('Select', module);
stories.addDecorator(withKnobs);

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

stories.add('Basic', () => (
    <div>
        <Select options={smallList} onChange={action('onChange')} inline={true} width={300} />
        <Select options={longList} onChange={action('onChange')} inline={true} width={300} />
    </div>
));
stories.add('Required', () => (
    <div>
        <Select options={longList} onChange={action('onChange')} inline={true} width={300} required={true} />
    </div>
));
stories.add('Different positions on page', () => (
    <div className="selectPositionsWrapper">
        <Select className="selectPositions top left" options={longList} inline={true} width={300} />
        <Select className="selectPositions top center" options={longList} inline={true} width={300} />
        <Select className="selectPositions top right" options={longList} inline={true} width={300} />
        <Select className="selectPositions middle left" options={longList} inline={true} width={300} />
        <Select className="selectPositions middle center" options={longList} inline={true} width={300} />
        <Select className="selectPositions middle right" options={longList} inline={true} width={300} />
        <Select className="selectPositions bottom left" options={longList} inline={true} width={300} />
        <Select className="selectPositions bottom center" options={longList} inline={true} width={300} />
        <Select className="selectPositions bottom right" options={longList} inline={true} width={300} />
    </div>
));
