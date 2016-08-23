'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Select = function (_React$Component) {
    _inherits(Select, _React$Component);

    function Select(props) {
        _classCallCheck(this, Select);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Select).call(this, props));

        var defaults = {
            options: [],
            width: 150,
            height: 48,
            value: '',
            message: 'Please select something',
            selected: null,
            animation: true,
            animationDuration: 300,
            empty: true,
            inline: false,
            error: false,
            open: false,
            required: false
        };
        var state = _lodash2.default.merge(defaults, _lodash2.default.pick(props, Object.keys(defaults)));

        _lodash2.default.each(state.options, function (value, key) {
            if (!_lodash2.default.isObject(value)) {
                value = {
                    text: value
                };
            }
            if ((!state.selected || !state.selected.selected) && value.placeholder) {
                state.placeholder = value;
                state.selected = value;
            }
            if (value.selected) state.selected = value;
            value.key = key;

            state.options[key] = value;
        });
        if (state.selected) state.value = state.selected.text;
        _this.state = state;

        _this.validator = _lodash2.default.isFunction(props.validator) ? props.validator : _this.defaultValidator.bind(_this);
        _this.onChange = _lodash2.default.isFunction(props.onChange) ? props.onChange : function () {};

        _this.close = _this.close.bind(_this);
        _this.open = _this.open.bind(_this);
        _this.clickLi = _this.clickLi.bind(_this);
        _this.clickBody = _this.clickBody.bind(_this);
        return _this;
    }

    _createClass(Select, [{
        key: 'defaultValidator',
        value: function defaultValidator(e) {
            e = e.text;
            return e && e.length <= 0;
        }
    }, {
        key: 'close',
        value: function close() {
            var _this2 = this;

            setTimeout(function () {
                _this2.setState({
                    onTop: false
                });
            }, this.state.animationDuration);
            this.setState({
                open: false
            });
            $(this.refs.select).animate({
                scrollTop: 0
            }, this.state.animationDuration, 'linear');

            this.setState({
                error: this.validator(this.state.value) || this.state.required && this.state.selected == this.state.placeholder
            });
        }
    }, {
        key: 'open',
        value: function open() {
            var _this3 = this;

            this.setState({
                open: true,
                onTop: true
            });

            var pos = Math.max((this.state.options.indexOf(this.state.selected) - 2) * this.state.height, 0);

            setTimeout(function () {
                $(_this3.refs.select).animate({
                    scrollTop: pos
                }, _this3.state.animationDuration, 'linear');
            });
        }
    }, {
        key: 'clickLi',
        value: function clickLi(e) {
            var id = e.target.attributes['data-id'].value;
            var selected = this.state.options[id];
            this.setState({
                value: this.state.options[id].text
            });

            if (this.state.open) {
                this.setState({
                    selected: selected
                });

                this.onChange(this.state.selected.text, this.state.selected);
                this.close();
                e.stopPropagation();
            }
        }
    }, {
        key: 'clickBody',
        value: function clickBody(e) {
            var target = e.target.className.indexOf('materialSelect') != -1 ? $(e.target) : $(e.target).parents('.materialSelect');

            if (target[0] == this.refs.wrapper) this.open();else this.close();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            $(document.body).on('click', this.clickBody);
            $(this.refs.wrapper).on('click', 'li', this.clickLi);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            $(document.body).off('click', this.clickBody);
            $(this.refs.wrapper).off('click', 'li', this.clickLi);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var wrapperClasses = (0, _classnames2.default)({
                materialSelect: true,
                inline: this.state.inline,
                error: this.state.error,
                empty: this.state.empty,
                animate: this.state.animation
            });
            var wrapperStyle = {
                width: this.state.inline ? this.state.width : false
            };
            var selectClasses = (0, _classnames2.default)({
                select: true,
                open: this.state.open,
                onTop: this.state.onTop
            });
            var optionsNumber = this.state.options.length - (this.state.placeholder ? 1 : 0);
            var height = !this.state.open ? this.state.height : Math.min(optionsNumber * this.state.height, 5 * this.state.height);
            var selectStyle = {
                transform: this.state.open ? 'translate(0, calc(' + this.state.height / 2 + 'px - 50%))' : false,
                overflow: this.state.open ? 'auto' : false,
                height: height
            };

            var content;
            if (this.state.onTop) {
                content = this.state.options.map(function (option, key) {
                    if (option.placeholder && _this4.state.required) {
                        return '';
                    }

                    return _react2.default.createElement(
                        'li',
                        { className: _this4.state.selected.key == key ? 'selected' : '', 'data-id': key, key: key },
                        option.text
                    );
                });
            } else if (this.state.selected) {
                content = _react2.default.createElement(
                    'li',
                    { className: 'selected', 'data-id': this.state.selected.key },
                    this.state.selected.text
                );
            }

            return _react2.default.createElement(
                'div',
                { className: wrapperClasses, style: wrapperStyle, ref: 'wrapper' },
                _react2.default.createElement(
                    'ul',
                    { className: selectClasses, style: selectStyle, ref: 'select' },
                    content
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'message' },
                    this.state.message
                )
            );
        }
    }]);

    return Select;
}(_react2.default.Component);

Select.propTypes = {
    options: _react2.default.PropTypes.array,
    height: _react2.default.PropTypes.number,
    animation: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.bool, _react2.default.PropTypes.string]),
    inline: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.bool, _react2.default.PropTypes.string]),
    open: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.bool, _react2.default.PropTypes.string]),
    required: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.bool, _react2.default.PropTypes.string]),
    message: _react2.default.PropTypes.string,
    onChange: _react2.default.PropTypes.func,
    validator: _react2.default.PropTypes.func
};

exports.default = Select;