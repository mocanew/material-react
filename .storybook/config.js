import { configure } from '@storybook/react';

function loadStories() {
    require('../src/stories.js');
}

configure(loadStories, module);