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

        message: PropTypes.string,

        className: PropTypes.string,
        style: PropTypes.object,
        validator: PropTypes.func,
        inputRef: PropTypes.func,
        onInput: PropTypes.func,
        onChange: PropTypes.func,
        onBlur: PropTypes.func,
        onFocus: PropTypes.func,
    }
    static defaultProps = {
        required: false,
        message: 'This field is required',
        inputRef: () => { },
        onInput: () => { },
        onChange: () => { },
        onBlur: () => { },
        onFocus: () => { },
        validator: Input.defaultValidator
    }
    static defaultValidator(inputValue, options) {
        if (typeof inputValue != 'string') {
            return;
        }

        return {
            empty: inputValue.length == 0,
            error: options.required && inputValue.trim().length == 0 ? true : false
        };
    }
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            empty: true,
            value: ''
        };
        this.lastInput = '';

        this.validate = this.validate.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.parseProps = this.parseProps.bind(this);
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
        var input = e.target.value;

        this.props.onInput(input);

        var newState = {
            value: input
        };
        if (this.state.empty && input.length) {
            newState.empty = false;
        }

        this.setState(newState);
    }
    onBlur() {
        var input = this.state.value;
        input = this.validate(input);

        if (this.lastInput != input) {
            this.props.onChange(input);
            this.lastInput = input;
        }
        this.props.onBlur();
    }
    validate(input) {
        var validatorResponse = this.props.validator(input, {
            required: this.props.required
        });
        if (!validatorResponse) {
            this.setState({
                error: true
            });
            return;
        }

        if (!validatorResponse.message) {
            validatorResponse.message = this.props.message;
        }
        if (validatorResponse.value) {
            input = validatorResponse.value;
        }
        var newState = {
            empty: validatorResponse.empty,
            error: validatorResponse.error,
            message: '',
            value: input
        };
        if ((newState.empty && this.props.required) || newState.error) {
            newState.message = validatorResponse.message;
        }
        this.setState(newState);
        if (typeof validatorResponse.callback == 'function') {
            setTimeout(validatorResponse.callback);
        }
        return input;
    }
    componentWillMount() {
        this.parseProps(this.props);
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
            this.validate(newState.value);
        }

        this.setState(newState);
    }
    render() {
        var parentClasses = classNames(this.props.className, {
            materialInput: true,
            error: this.state.error,
            empty: this.state.empty
        });

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
                <div className="message">{this.state.message}</div>
            </div>
        );
    }
}

export default Input;