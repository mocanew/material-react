import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import './index.scss';

class Select extends React.Component {
    constructor(props) {
        super(props);
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
        var state = _.merge(defaults, _.pick(props, Object.keys(defaults)));

        _.each(state.options, (value, key) => {
            if (!_.isObject(value)) {
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
        this.state = state;

        this.validator = _.isFunction(props.validator) ? props.validator : this.defaultValidator.bind(this);
        this.onChange = _.isFunction(props.onChange) ? props.onChange : () => { };

        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.clickLi = this.clickLi.bind(this);
        this.clickBody = this.clickBody.bind(this);
    }
    defaultValidator(e) {
        e = e.text;
        return e && e.length <= 0;
    }
    close() {
        setTimeout(() => {
            this.setState({
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
            error: this.validator(this.state.value) || (this.state.required && this.state.selected == this.state.placeholder)
        });
    }
    open() {
        this.setState({
            open: true,
            onTop: true
        });

        var pos = Math.max((this.state.options.indexOf(this.state.selected) - 2) * this.state.height, 0);

        setTimeout(() => {
            $(this.refs.select).animate({
                scrollTop: pos
            }, this.state.animationDuration, 'linear');
        });
    }
    clickLi(e) {
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
    clickBody(e) {
        var target = e.target.className.indexOf('materialSelect') != -1 ? $(e.target) : $(e.target).parents('.materialSelect');

        if (target[0] == this.refs.wrapper) this.open();
        else this.close();
    }
    componentDidMount() {
        $(document.body).on('click', this.clickBody);
        $(this.refs.wrapper).on('click', 'li', this.clickLi);
    }
    componentWillUnmount() {
        $(document.body).off('click', this.clickBody);
        $(this.refs.wrapper).off('click', 'li', this.clickLi);
    }
    render() {
        var wrapperClasses = classnames({
            materialSelect: true,
            inline: this.state.inline,
            error: this.state.error,
            empty: this.state.empty,
            animate: this.state.animation
        });
        var wrapperStyle = {
            width: this.state.inline ? this.state.width : false
        };
        var selectClasses = classnames({
            select: true,
            open: this.state.open,
            onTop: this.state.onTop
        });
        var optionsNumber = this.state.options.length - (this.state.placeholder ? 1 : 0);
        var height = !this.state.open ? this.state.height : Math.min(optionsNumber * this.state.height, 5 * this.state.height);
        var selectStyle = {
            transform: this.state.open ? `translate(0, calc(${this.state.height / 2}px - 50%))` : false,
            overflow: this.state.open ? 'auto' : false,
            height: height
        };

        var content;
        if (this.state.onTop) {
            content = this.state.options.map((option, key) => {
                if (option.placeholder && this.state.required) {
                    return '';
                }

                return <li className={this.state.selected.key == key ? 'selected' : ''} data-id={key} key={key}>{option.text}</li>;
            });
        }
        else if (this.state.selected) {
            content = <li className="selected" data-id={this.state.selected.key}>{this.state.selected.text}</li>;
        }

        return (
            <div className={wrapperClasses} style={wrapperStyle} ref="wrapper">
                <ul className={selectClasses} style={selectStyle} ref="select">
                    {
                        content
                    }
                </ul>
                <div className="message">{this.state.message}</div>
            </div>
        );
    }
}

Select.propTypes = {
    options: React.PropTypes.array,
    height: React.PropTypes.number,
    animation: React.PropTypes.oneOfType([
        React.PropTypes.bool,
        React.PropTypes.string
    ]),
    inline: React.PropTypes.oneOfType([
        React.PropTypes.bool,
        React.PropTypes.string
    ]),
    open: React.PropTypes.oneOfType([
        React.PropTypes.bool,
        React.PropTypes.string
    ]),
    required: React.PropTypes.oneOfType([
        React.PropTypes.bool,
        React.PropTypes.string
    ]),
    message: React.PropTypes.string,
    onChange: React.PropTypes.func,
    validator: React.PropTypes.func
};

export default Select;