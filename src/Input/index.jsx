import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.scss';

class Input extends React.Component {
    static propTypes = {
        multiline: PropTypes.bool,
        required: PropTypes.bool,

        autoComplete: PropTypes.bool,
        autoFocus: PropTypes.bool,
        disabled: PropTypes.bool,
        readOnly: PropTypes.bool,
        autoCorrect: PropTypes.bool,

        name: PropTypes.string,
        title: PropTypes.string,
        type: PropTypes.string,
        value: PropTypes.string,
        placeholder: PropTypes.string,

        inputMode: PropTypes.string,
        pattern: PropTypes.string,
        tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        maxLength: PropTypes.string,

        className: PropTypes.string,
        style: PropTypes.object,
        validator: PropTypes.func,
        validateOnInput: PropTypes.bool,
        inputRef: PropTypes.func,
        onInput: PropTypes.func,
        onChange: PropTypes.func,
        onBlur: PropTypes.func,
        onFocus: PropTypes.func,
    }
    static defaultProps = {
        required: false,
        inputRef: () => { },
        onInput: () => { },
        onChange: () => { },
        onBlur: () => { },
        onFocus: () => { },
        validator: Input.defaultValidator
    }
    static defaultValidator(inputValue, options) {
        if (typeof inputValue != 'string') {
            return null;
        }

        if (inputValue.length == 0 && options.required && inputValue.trim().length == 0) {
            return {
                message: 'All fields are required',
                error: true
            };
        }

        return null;
    }
    constructor(props) {
        super(props);
        this.state = {
            showMessage: false,
            empty: true,
            value: ''
        };
        this.lastInput = '';

        this.validate = this.validate.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.parseProps = this.parseProps.bind(this);
    }
    setMessage(message, isError) {
        this.setState({
            showMessage: typeof message == 'string' ? message.length : message,
            message: message,
            error: isError
        });
    }
    onInput(e) {
        var input = e.target.value;

        this.props.onInput(input);

        var newState = {
            value: input
        };
        if (this.state.empty && input.length) {
            newState.empty = false;
        }

        if (this.props.validateOnInput) {
            this.validate(input, this.props, false);
        }

        this.setState(newState);
    }
    onBlur() {
        var validatedValue = this.validate(this.state.value, this.props);

        if (this.lastInput != validatedValue) {
            this.props.onChange(validatedValue);
            this.lastInput = validatedValue;
        }
        this.props.onBlur();
    }
    validate(input, props, setValue = true) {
        var validatorResponse = props.validator(input, {
            required: props.required,
            canTrim: setValue
        }) || {};

        if (setValue && validatorResponse.value !== undefined) {
            input = validatorResponse.value;
        }

        var newState = {
            empty: typeof input == 'string' ? !input.length : !input,
            error: validatorResponse.error,
            message: validatorResponse.message,
            showMessage: validatorResponse.message !== null && validatorResponse.message !== undefined,
            value: input
        };
        this.setState(newState);
        return input;
    }
    componentWillMount() {
        this.parseProps(this.props);
    }
    componentDidMount() {
        this.validate(undefined, this.props, false);
    }
    componentWillReceiveProps(newProps) {
        this.parseProps(newProps);
    }
    parseProps(props) {
        if (!props) {
            return;
        }

        var newState = {
            attributes: {}
        };

        var attributeNames = [
            'name',
            'title',
            'type',
            'required',
            'autoComplete',
            'autoFocus',
            'disabled',
            'inputMode',
            'pattern',
            'readOnly',
            'autoCorrect',
            'tabIndex',
            'maxLength'
        ];
        for (var i = 0; i < attributeNames.length; i++) {
            var attr = attributeNames[i];
            if (props[attr] !== undefined) {
                newState.attributes[attr] = props[attr];
            }
        }

        if (props.value !== undefined) {
            newState.empty = !props.value.length;
            newState.value = props.value;
            this.lastInput = props.value;
            this.validate(newState.value, props);
        }

        this.setState(newState);
    }
    render() {
        var parentClasses = classNames(this.props.className, {
            materialInput: true,
            error: this.state.error,
            showMessage: this.state.showMessage,
            empty: this.state.empty
        });

        if (this.state.message) {
            this.lastMessage = this.state.message;
        }

        var field;
        if (this.props.multiline) {
            field = <textarea
                className="input"
                {...this.state.attributes}
                onInput={this.onInput}
                onBlur={this.onBlur}
                onFocus={this.props.onFocus}
                value={this.state.value}
                ref={this.props.inputRef} />;
        }
        else {
            field = <input
                className="input"
                {...this.state.attributes}
                onInput={this.onInput}
                onBlur={this.onBlur}
                onFocus={this.props.onFocus}
                value={this.state.value}
                ref={this.props.inputRef} />;
        }
        return (
            <div className={parentClasses} style={this.props.style}>
                {field}
                <span className="highlight" />
                <span className="bar" />
                <label>{this.props.placeholder}</label>
                <div className="message">{this.state.message || this.lastMessage}</div>
            </div>
        );
    }
}

export default Input;