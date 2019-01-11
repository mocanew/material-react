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
        defaultValue: PropTypes.string,
        placeholder: PropTypes.string,

        inputMode: PropTypes.string,
        pattern: PropTypes.string,
        tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        maxLength: PropTypes.string,

        message: PropTypes.string,
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
        validator: Input.defaultValidator,
    }
    static defaultValidator(inputValue, options) {
        if (typeof inputValue != 'string') {
            return null;
        }

        if (inputValue.length == 0 && options.required && inputValue.trim().length == 0) {
            return {
                message: options.message || 'All fields are required',
                error: true,
            };
        }

        return null;
    }
    constructor(props) {
        super(props);
        this.state = {
            showMessage: false,
            value: props.defaultValue || '',
            lastInput: '',
        };

        this.validate = this.validate.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }
    setMessage(message, isError) {
        this.setState({
            showMessage: typeof message == 'string' ? message.length : message,
            message: message,
            error: isError,
        });
    }
    onInput(e) {
        var input = e.target.value;

        this.props.onInput(input);

        var newState = {
            value: input,
        };

        if (this.props.validateOnInput) {
            this.validate(input, this.props, false);
        }

        this.setState(newState);
    }
    onFocus(e) {
        if (this.state.value === undefined) {
            this.setState({
                value: '',
            });
        }
        this.props.onFocus(e);
    }
    onBlur(e) {
        var validatedValue = this.validate(this.state.value, this.props);

        if (this.state.lastInput != validatedValue) {
            this.props.onChange(validatedValue);

            this.setState({
                lastInput: validatedValue,
            });
        }
        this.props.onBlur(e);
    }
    validate(input, props, setValue = true) {
        var validatorResponse = props.validator(input, {
            required: props.required,
            canTrim: setValue,
            message: props.message,
        }) || {};

        if (setValue && validatorResponse.value !== undefined) {
            input = validatorResponse.value;
        }

        var newState = {
            error: validatorResponse.error,
            message: validatorResponse.message,
            showMessage: validatorResponse.message !== null && validatorResponse.message !== undefined,
        };
        if (setValue) {
            newState.value = input;
        }

        this.setState(newState);
        return input;
    }
    componentDidMount() {
        this.validate(undefined, this.props, false);
    }
    static getDerivedStateFromProps(props) {
        if (!props) {
            return null;
        }

        var newState = {
            attributes: {},
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
            'maxLength',
        ];
        for (var i = 0; i < attributeNames.length; i++) {
            var attr = attributeNames[i];
            if (props[attr] !== undefined) {
                newState.attributes[attr] = props[attr];
            }
        }

        if (props.value !== undefined) {
            newState.value = props.value;
            newState.lastInput = props.value;
        }

        return newState;
    }
    render() {
        var parentClasses = classNames(this.props.className, {
            materialInput: true,
            error: this.state.error,
            showMessage: this.state.showMessage,
            empty: !this.state.value.length,
        });

        if (this.state.message) {
            this.lastMessage = this.state.message;
        }

        var field;
        if (this.props.multiline) {
            field = <textarea
                className="input"
                onChange={() => { }}
                {...this.state.attributes}
                onInput={this.onInput}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                value={this.state.value}
                ref={this.props.inputRef} />;
        }
        else {
            field = <input
                className="input"
                onChange={() => { }}
                {...this.state.attributes}
                onInput={this.onInput}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
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