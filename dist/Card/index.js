'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _materialButton = require('./materialButton.jsx');

var _materialButton2 = _interopRequireDefault(_materialButton);

var _input = require('./input.jsx');

var _input2 = _interopRequireDefault(_input);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Card = function (_React$Component) {
    _inherits(Card, _React$Component);

    function Card(props) {
        _classCallCheck(this, Card);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Card).call(this, props));

        _this.state = {
            power: _this.props.power,
            ip: _this.props.ip,
            mac: _this.props.mac
        };
        _this.wake = _this.wake.bind(_this);
        _this.ping = _this.ping.bind(_this);
        _this.save = _this.save.bind(_this);

        _this.verifyIP = _this.verifyIP.bind(_this);
        _this.verifyMAC = _this.verifyMAC.bind(_this);

        _this.response = _this.response.bind(_this);

        _this.name = _this.props.name ? _this.props.name : 'Computer ' + _this.props.id;
        return _this;
    }

    _createClass(Card, [{
        key: 'response',
        value: function response(e) {
            if (e.ip && e.ip == this.state.ip || e.mac && e.mac == this.state.mac) {
                this.setState({
                    power: e.isAlive
                });
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            socket.on('WakeOnLan:response', this.response);
            this.ping();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            socket.off('WakeOnLan:response', this.response);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (!nextProps.direct && nextProps.power == this.props.power) return;

            this.setState({
                power: nextProps.power
            });
        }
    }, {
        key: 'wake',
        value: function wake() {
            this.setState({
                power: ''
            });
            socket.emit('WakeOnLan', {
                ip: this.state.ip,
                mac: this.state.mac
            });
        }
    }, {
        key: 'ping',
        value: function ping() {
            this.setState({
                power: ''
            });
            socket.emit('WakeOnLan:ping', {
                ip: this.state.ip,
                mac: this.state.mac
            });
        }
    }, {
        key: 'save',
        value: function save() {
            var error = this.refs.ip.state.error || this.refs.mac.state.error;
            if (this.refs.ip.value.trim().length <= 0 && this.refs.mac.value.trim().length <= 0) {
                var temp = {
                    error: true
                };
                error = true;
                this.refs.ip.setState(temp);
                this.refs.mac.setState(temp);
            }
            this.refs.ip.state.error ? this.refs.ip.highlightError() : true;
            this.refs.mac.state.error ? this.refs.mac.highlightError() : true;

            if (error) return;

            this.refs.name.clear();
            this.refs.ip.clear();
            this.refs.mac.clear();

            this.props.onSave({
                name: this.refs.name.value,
                ip: this.refs.ip.value,
                mac: this.refs.mac.value
            });
        }
    }, {
        key: 'verifyIP',
        value: function verifyIP(e, options) {
            var _this2 = this;

            var ipv4Regex = /^(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})(.(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})){3}$/;
            var ipv6Regex = /^([0-9a-f]|:){1,4}(:([0-9a-f]{0,4})*){1,7}$/i;
            var empty = _input2.default.defaultValidator(e).empty;
            var error = empty ? false : !(ipv4Regex.test(e) || ipv6Regex.test(e));
            return {
                empty: empty,
                error: empty && this.state.mac.length <= 0 || error,
                message: error ? true : empty && this.state.mac.length <= 0 ? 'Trebuie să introduceți o adresă IP sau un MAC' : false,
                callback: function callback() {
                    if (!options.artificial) _this2.refs.mac.onInput(true);
                }
            };
        }
    }, {
        key: 'verifyMAC',
        value: function verifyMAC(e, options) {
            var _this3 = this;

            var macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
            var empty = _input2.default.defaultValidator(e).empty;
            var error = empty ? false : !macRegex.test(e);
            return {
                empty: empty,
                error: empty && this.state.ip.length <= 0 || error,
                message: error ? true : empty && this.state.ip.length <= 0 ? 'Trebuie să introduceți o adresă IP sau un MAC' : false,
                callback: function callback() {
                    if (!options.artificial) _this3.refs.ip.onInput(true);
                }
            };
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            if (typeof this.props.onSave == 'function') {
                return _react2.default.createElement(
                    'div',
                    { className: 'wolCard new' },
                    _react2.default.createElement(
                        'div',
                        { className: 'wrapper' },
                        _react2.default.createElement(
                            _input2.default,
                            { ref: 'name' },
                            'Computer name'
                        ),
                        _react2.default.createElement(
                            _input2.default,
                            { validator: this.verifyIP, onChange: function onChange(e) {
                                    return _this4.setState({ ip: e });
                                }, message: 'Introduceți o adresă IP validă', ref: 'ip' },
                            'IP'
                        ),
                        _react2.default.createElement(
                            _input2.default,
                            { validator: this.verifyMAC, onChange: function onChange(e) {
                                    return _this4.setState({ mac: e });
                                }, message: 'Introduceți o adresă MAC validă', ref: 'mac' },
                            'MAC'
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'buttonsRow' },
                            _react2.default.createElement(
                                _materialButton2.default,
                                { buttonStyle: 'flat', onClick: this.save },
                                'Add'
                            )
                        )
                    )
                );
            }

            var power = (0, _classnames2.default)({
                power: true,
                pinging: typeof this.state.power != 'boolean' ? true : false,
                on: this.state.power === true ? true : false
            });
            var imageStyle = {
                backgroundImage: 'url("' + this.props.image + '")'
            };
            return _react2.default.createElement(
                'div',
                { className: 'wolCard' },
                _react2.default.createElement(
                    'div',
                    { className: 'wrapper' },
                    _react2.default.createElement(
                        'div',
                        { title: 'Șterge', className: 'trash', onClick: this.props.remove(this.props.original) },
                        _react2.default.createElement('i', { className: 'fa fa-trash-o fa-fw' })
                    ),
                    _react2.default.createElement(
                        'div',
                        { title: this.state.power === true ? 'Pornit' : this.state.power === false ? 'Oprit' : '', className: power, onClick: this.ping },
                        typeof this.state.power != 'boolean' ? _react2.default.createElement('i', { className: 'fa fa-refresh fa-spin fa-fw' }) : ''
                    ),
                    _react2.default.createElement('div', { className: 'image', style: imageStyle }),
                    _react2.default.createElement(
                        'div',
                        { className: 'titleRow' },
                        _react2.default.createElement(
                            'div',
                            { className: 'title' },
                            this.name
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'subtitle' },
                            this.props.ip && this.props.ip.length ? this.props.mac && this.props.mac.length ? this.props.ip + ' - ' + this.props.mac : this.props.ip : this.props.mac
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'buttonsRow' },
                        _react2.default.createElement(
                            _materialButton2.default,
                            { buttonStyle: 'flat', onClick: this.ping },
                            'Ping'
                        ),
                        _react2.default.createElement(
                            _materialButton2.default,
                            { buttonStyle: 'flat', onClick: this.wake },
                            'Wake'
                        )
                    )
                )
            );
        }
    }], [{
        key: 'defaultProps',
        get: function get() {
            return {
                power: false,
                name: '',
                ip: '',
                mac: '',
                image: '/images/general.png'
            };
        }
    }]);

    return Card;
}(_react2.default.Component);

Card.propTypes = {
    id: _react2.default.PropTypes.number,
    name: _react2.default.PropTypes.string,
    ip: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.bool]),
    mac: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.bool]),
    original: _react2.default.PropTypes.object,
    image: _react2.default.PropTypes.string,
    power: _react2.default.PropTypes.bool,
    onSave: _react2.default.PropTypes.func,
    remove: _react2.default.PropTypes.func
};

exports.default = Card;