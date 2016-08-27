import React from 'react';
import './index.scss';
import classNames from 'classnames';
import _ from 'lodash';

class Input extends React.Component {
    constructor(props) {
        super(props);
        var defaults = {
            error: false,
            empty: true,
            name: '',
            title: '',
            type: 'text',
            required: false,
            message: '',
            multiline: false,
            value: ''
        };
        var state = _.merge({}, defaults, _.pick(props, Object.keys(defaults)));
        state.name = props.name ? props.name : props.children;
        state.title = props.title ? props.title : props.children;
        state.empty = state.value.length <= 0;
        this.state = state;
        this.validator = _.isFunction(props.validator) ? props.validator : Input.defaultValidator;
        this.onInput = this.onInput.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }
    static get defaultProps() {
        return {
            name: '',
            title: '',
            required: false,
            message: 'This field is required'
        };
    }
    static defaultValidator(e, options) {
        var empty = (e.trim().length > 0) ? false : true;
        return {
            empty: empty,
            error: options && options.required && empty ? true : false
        };
    }
    highlightError() {
        if (!this.state.error) return;
        this.setState({
            error: false
        });
        setTimeout(() => this.setState({
            error: true
        }), 500);
    }
    onBlur(e) {
        this.onInput();
        if (_.isFunction(this.props.onBlur)) this.props.onBlur(e);
    }
    onInput() {
        var input = this.refs.input.value;

        if (_.isFunction(this.props.onInput)) this.props.onInput(input);
        if (_.isFunction(this.props.onChange) && this.state.value.trim() != input.trim()) this.props.onChange(input.trim());

        var validator = this.validator(input, {
            required: this.state.required
        });
        if (!_.isString(validator.message)) {
            validator.message = this.state.message;
        }
        if (_.isString(validator.value)) {
            input = validator.value;
        }
        if (this.state.multiline) {
            this.refs.input.style.height = 0;
            var computedStyle = window.getComputedStyle(this.refs.input);
            this.refs.input.style.height = (this.refs.input.scrollHeight - parseInt(computedStyle.paddingTop) - parseInt(computedStyle.paddingBottom)) + 'px';
        }
        this.setState({
            empty: validator.empty,
            error: validator.error,
            message: validator.message,
            value: input
        });
        if (_.isFunction(validator.callback)) {
            setTimeout(validator.callback);
        }
    }
    clear() {
        this.refs.input.value = '';
        this.setState({
            empty: true,
            error: false
        });
    }
    componentDidMount() {
        if (this.state.multiline) {
            this.refs.input.style.height = 0;
        }
    }
    render() {
        var parentClasses = classNames({
            materialInput: true,
            error: this.state.error,
            empty: this.state.empty
        });
        var field;
        if (this.state.multiline) {
            field = <textarea className="input" name={this.state.name} onInput={this.onInput} onBlur={this.onBlur} ref="input" value={this.state.value} />;
        }
        else {
            field = <input className="input" type={this.state.type} name={this.state.name} onInput={this.onInput} onBlur={this.onBlur} ref="input" required={this.state.required} value={this.state.value} />;
        }
        return (
            <div className={parentClasses} ref="parent">
                {field}
                <span className="highlight"></span>
                <span className="bar"></span>
                <label htmlFor="name">{this.state.title}</label>
                <div className="message">{this.state.message}</div>
            </div>
        );
    }
}

Input.propTypes = {
    multiline: React.PropTypes.bool,
    required: React.PropTypes.bool,
    name: React.PropTypes.string,
    children: React.PropTypes.string,
    title: React.PropTypes.string,
    message: React.PropTypes.string,
    type: React.PropTypes.string,
    value: React.PropTypes.string,
    onBlur: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onInput: React.PropTypes.func,
    validator: React.PropTypes.func
};

export default Input;