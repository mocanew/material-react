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

(0, _storybook.storiesOf)('Button', module).add('Required & not required', function () {
    return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
            _index2.default,
            { buttonStyle: 'flat' },
            'Flat button'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
            _index2.default,
            { buttonStyle: 'raised' },
            'Raised button'
        )
    );
});