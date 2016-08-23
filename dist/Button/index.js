'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var classNames = require('classnames');

var MaterialButton = function (_React$Component) {
    _inherits(MaterialButton, _React$Component);

    function MaterialButton(props) {
        _classCallCheck(this, MaterialButton);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MaterialButton).call(this, props));

        _this.state = {
            drop: true,
            drops: [],
            toggleState: false
        };
        _this.onMouseDown = _this.onMouseDown.bind(_this);
        _this.updateDrop = _this.updateDrop.bind(_this);
        _this.findFreeDrop = _this.findFreeDrop.bind(_this);
        _this.createDrop = _this.createDrop.bind(_this);
        _this.onClick = _this.onClick.bind(_this);
        return _this;
    }

    _createClass(MaterialButton, [{
        key: 'onClick',
        value: function onClick() {
            if (typeof this.props.onClick == 'function') this.props.onClick();
            this.setState({
                toggleState: !this.state.toggleState
            });
        }
    }, {
        key: 'updateDrop',
        value: function updateDrop(e, index) {
            var _this2 = this;

            var drop = this.state.drops[index];

            drop.done = false;
            drop.size = e.size;
            drop.top = e.top;
            drop.left = e.left;

            this.forceUpdate();
            setTimeout(function () {
                drop.done = true;
                _this2.forceUpdate();
            }, 1000);
        }
    }, {
        key: 'createDrop',
        value: function createDrop(callback) {
            var _this3 = this;

            var drops = this.state.drops.concat([]);
            drops.push({
                size: 0,
                top: 0,
                left: 0,
                done: true
            });
            this.setState({
                drops: drops
            }, function () {
                return callback(_this3.state.drops.length - 1);
            });
        }
    }, {
        key: 'findFreeDrop',
        value: function findFreeDrop(callback) {
            var i = 0;
            if (!this.state.drops.length) {
                return this.createDrop(callback);
            }

            for (i = 0; i < this.state.drops.length; i++) {
                if (this.state.drops[i].done == true) {
                    return callback(i);
                }
            }
            this.createDrop(callback);
        }
    }, {
        key: 'onMouseDown',
        value: function onMouseDown(event) {
            var _this4 = this;

            event.stopPropagation();
            var page = {
                x: event.pageX,
                y: event.pageY
            };
            if (this.state.drop) {
                var maxWidthHeight = Math.max(this.refs.button.offsetWidth, this.refs.button.offsetWidth);

                this.findFreeDrop(function (i) {
                    var rect = _this4.refs.button.getBoundingClientRect();
                    var x = page.x - maxWidthHeight / 2 - rect.left;
                    var y = page.y - maxWidthHeight / 2 - rect.top;

                    _this4.updateDrop({
                        size: maxWidthHeight,
                        top: y,
                        left: x
                    }, i);
                });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var toggleClass = this.state.toggleState ? this.props.toggleOffClass : this.props.toggleOnClass;
            var classes = classNames(this.props.classes, 'materialBtn', this.props.buttonStyle, toggleClass);
            return _react2.default.createElement(
                'div',
                { className: classes, onMouseDown: this.onMouseDown, onClick: this.onClick, ref: 'button' },
                this.state.drops.map(function (e, index) {
                    var classes = classNames({
                        drop: true,
                        animate: e.done == false
                    });
                    var style = {
                        width: e.size,
                        height: e.size,
                        top: e.top,
                        left: e.left
                    };
                    return _react2.default.createElement('b', { className: classes, style: style, key: index });
                }),
                this.props.children,
                classes.indexOf('iconBtn') >= 0 ? _react2.default.createElement(
                    'span',
                    null,
                    _react2.default.createElement('span', { className: 's1' }),
                    _react2.default.createElement('span', { className: 's2' }),
                    _react2.default.createElement('span', { className: 's3' })
                ) : ''
            );
        }
    }]);

    return MaterialButton;
}(_react2.default.Component);

MaterialButton.propTypes = {
    buttonStyle: _react2.default.PropTypes.string,
    classes: _react2.default.PropTypes.string,
    children: _react2.default.PropTypes.node,
    toggleOffClass: _react2.default.PropTypes.string,
    toggleOnClass: _react2.default.PropTypes.string,
    onClick: _react2.default.PropTypes.func
};

exports.default = MaterialButton;