'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./index.scss');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Input = function (_React$Component) {
    _inherits(Input, _React$Component);

    function Input(props) {
        _classCallCheck(this, Input);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Input).call(this, props));

        var state = _lodash2.default.merge({}, {
            error: false,
            empty: true,
            name: '',
            title: '',
            type: 'text',
            required: false,
            message: '',
            value: ''
        }, props);
        state.required = JSON.parse(props.required);
        state.name = props.name ? props.name : props.children;
        state.title = props.title ? props.title : props.children;
        state.empty = state.value.length <= 0;
        _this.state = state;
        _this.onInput = _this.onInput.bind(_this);
        return _this;
    }

    _createClass(Input, [{
        key: 'highlightError',
        value: function highlightError() {
            var _this2 = this;

            if (!this.state.error) return;
            this.setState({
                error: false
            });
            setTimeout(function () {
                return _this2.setState({
                    error: true
                });
            }, 500);
        }
    }, {
        key: 'onInput',
        value: function onInput(e) {
            var input = this.refs.input.value;
            if (typeof this.props.onInput == 'function') this.props.onInput(input);

            if (typeof this.props.onChange == 'function' && this.state.value.trim() != input.trim()) this.props.onChange(input.trim());

            var validator = Input.defaultValidator(input, {
                required: this.state.required
            });
            if (typeof this.props.validator == 'function') {
                validator = this.props.validator(input, {
                    required: this.state.required,
                    artificial: typeof e == 'boolean' ? e : false
                });
            }
            if (typeof validator.message != 'string') {
                validator.message = this.props.message;
            }

            this.setState({
                empty: validator.empty,
                error: validator.error,
                message: validator.message,
                value: input
            });
            if (typeof validator.callback == 'function') {
                setTimeout(validator.callback);
            }
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.refs.input.value = '';
            this.setState({
                empty: true,
                error: false
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var parentClasses = (0, _classnames2.default)({
                materialInput: true,
                error: this.state.error,
                empty: this.state.empty
            });
            return _react2.default.createElement(
                'div',
                { className: parentClasses, ref: 'parent' },
                _react2.default.createElement('input', { type: this.state.type, name: this.state.name, onInput: this.onInput, onBlur: this.onInput, ref: 'input', required: this.state.required, defaultValue: this.state.value }),
                _react2.default.createElement('span', { className: 'highlight' }),
                _react2.default.createElement('span', { className: 'bar' }),
                _react2.default.createElement(
                    'label',
                    { htmlFor: 'name' },
                    this.state.title + (this.state.required ? '*' : '')
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'message' },
                    this.state.message
                )
            );
        }
    }], [{
        key: 'defaultValidator',
        value: function defaultValidator(e, options) {
            var empty = e.trim().length > 0 ? false : true;
            return {
                empty: empty,
                error: options && options.required && empty ? true : false
            };
        }
    }, {
        key: 'defaultProps',
        get: function get() {
            return {
                name: '',
                title: '',
                required: false,
                message: 'This field is required'
            };
        }
    }]);

    return Input;
}(_react2.default.Component);

Input.propTypes = {
    name: _react2.default.PropTypes.string,
    children: _react2.default.PropTypes.string,
    title: _react2.default.PropTypes.string,
    required: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.bool, _react2.default.PropTypes.string]),
    message: _react2.default.PropTypes.string,
    type: _react2.default.PropTypes.string,
    value: _react2.default.PropTypes.string,
    onChange: _react2.default.PropTypes.func,
    onInput: _react2.default.PropTypes.func,
    validator: _react2.default.PropTypes.func
};

exports.default = Input;