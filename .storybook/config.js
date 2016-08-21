import { configure } from '@kadira/storybook';

function loadStories() {
    require('../src/stories.js');
}

configure(loadStories, module);