'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _storybook = require('@kadira/storybook');

var _index = require('./index.jsx');

var _index2 = _interopRequireDefault(_index);

require('../_story.scss');

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.$ = _jquery2.default;

var smallList = [{
    placeholder: true,
    text: 'Choose your country...'
}, 'France', 'Romania', 'USA'];
var longList = [{
    placeholder: true,
    text: 'Choose your country...'
}, 'France', 'Belgium', 'Spain', 'Portugal', 'Hungary', 'Romania', 'Rusia', 'USA'];
var style = {
    minHeight: 'calc(100vh - 200px)',
    paddingLeft: 50,
    paddingTop: 200
};

(0, _storybook.storiesOf)('Select', module).add('Basic', function () {
    return _react2.default.createElement(
        'div',
        { style: style },
        _react2.default.createElement(_index2.default, { options: smallList, onChange: (0, _storybook.action)('onChange'), inline: true, width: 300 }),
        _react2.default.createElement(_index2.default, { options: longList, onChange: (0, _storybook.action)('onChange'), inline: true, width: 300 })
    );
}).add('Required', function () {
    return _react2.default.createElement(
        'div',
        { style: style },
        _react2.default.createElement(_index2.default, { options: longList, onChange: (0, _storybook.action)('onChange'), inline: true, width: 300, required: true })
    );
});