import React from 'react';
import './index.scss';
import classNames from 'classnames';
import _ from 'lodash';

class Input extends React.Component {
    constructor(props) {
        super(props);
        var state = _.merge({}, {
            error: false,
            empty: true,
            name: '',
            title: '',
            type: 'text',
            required: false,
            message: '',
            multiline: false,
            value: ''
        }, props);
        state.required = JSON.parse(props.required);
        state.name = props.name ? props.name : props.children;
        state.title = props.title ? props.title : props.children;
        state.empty = state.value.length <= 0;
        this.state = state;
        this.onInput = this.onInput.bind(this);
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
    onInput(e) {
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
        this.refs.input.style.height = 0;
        var computedStyle = window.getComputedStyle(this.refs.input);
        this.refs.input.style.height = (this.refs.input.scrollHeight - parseInt(computedStyle.paddingTop) - parseInt(computedStyle.paddingBottom)) + 'px';
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
    clear() {
        this.refs.input.value = '';
        this.setState({
            empty: true,
            error: false
        });
    }
    componentDidMount() {
        this.refs.input.style.height = 0;
    }
    render() {
        var parentClasses = classNames({
            materialInput: true,
            error: this.state.error,
            empty: this.state.empty
        });
        var field;
        if (this.state.multiline) {
            field = <textarea className="input" name={this.state.name} onInput={this.onInput} onBlur={this.onInput} ref="input" defaultValue={this.state.value} />;
        }
        else {
            field = <input className="input" type={this.state.type} name={this.state.name} onInput={this.onInput} onBlur={this.onInput} ref="input" required={this.state.required} defaultValue={this.state.value} />;
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
    name: React.PropTypes.string,
    children: React.PropTypes.string,
    title: React.PropTypes.string,
    multiline: React.PropTypes.bool,
    required: React.PropTypes.oneOfType([
        React.PropTypes.bool,
        React.PropTypes.string
    ]),
    message: React.PropTypes.string,
    type: React.PropTypes.string,
    value: React.PropTypes.string,
    onChange: React.PropTypes.func,
    onInput: React.PropTypes.func,
    validator: React.PropTypes.func
};

export default Input;