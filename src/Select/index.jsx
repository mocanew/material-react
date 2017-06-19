import React from 'react';
import PropTypes from 'prop-types';
import smoothscroll from 'smoothscroll';
import classnames from 'classnames';
import './index.scss';

import Button from '../Button/';

class Select extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        options: PropTypes.array,
        value: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
        inline: PropTypes.bool,
        required: PropTypes.bool,
        message: PropTypes.string,
        onChange: PropTypes.func,
        validator: PropTypes.func,
        animation: PropTypes.bool,
        animationDuration: PropTypes.number
    }
    static defaultProps = {
        onChange: () => { },
        validator: Select.defaultValidator,
        width: 150,
        height: 48,
        inline: false,
        required: false,
        animation: true,
        animationDuration: 300
    }
    static cumulativeOffset(element) {
        var top = 0, left = 0;
        do {
            top += element.offsetTop || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while (element);

        return {
            top: top,
            left: left
        };
    }
    static defaultValidator(e) {
        e = e.text;
        return e && e.length <= 0;
    }
    constructor(props) {
        super(props);
        var state = {
            options: [],
            value: '',
            message: 'Please select something',
            selected: null,
            empty: true,
            error: false,
            open: false
        };

        Object.keys(state).forEach(key => {
            if (props[key] !== undefined) {
                state[key] = props[key];
            }
        });
        this.state = state;

        this.parseOptions = this.parseOptions.bind(this);
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.clickBody = this.clickBody.bind(this);
    }
    parseOptions(options) {
        var tempState = {};
        options.forEach((value, i) => {
            if (typeof value != 'object') {
                value = {
                    text: value
                };
                options[i] = value;
            }

            if (!tempState.selected && value.placeholder) {
                tempState.selected = value;
                tempState.placeholder = value;
            }

            if (value.selected) {
                tempState.selected = value;
            }

            if (value.key === undefined) {
                value.key = i;
            }
        });
        tempState.options = options;
        this.setState(tempState);
        return options;
    }
    close() {
        if (!this.state.open) {
            return;
        }

        this.timeout = setTimeout(() => {
            this.setState({
                onTop: false
            });
        }, this.props.animationDuration);
        this.setState({
            open: false
        });
        smoothscroll(0, this.props.animationDuration, null, this.select);

        this.setState({
            error: this.props.validator(this.state.selected.text) || (this.state.required && this.state.selected == this.state.placeholder)
        });
    }
    open() {
        if (this.state.open) {
            return;
        }
        clearTimeout(this.timeout);
        this.setState({
            open: true,
            onTop: true
        });

        var pos = Math.max((this.state.options.indexOf(this.state.selected) - 2) * this.props.height, 0);

        smoothscroll(pos, this.props.animationDuration, null, this.select);
    }
    clickLi(id) {
        if (!this.state.open) {
            return;
        }

        var selected = this.state.options[id];
        this.setState({
            value: selected.text,
            selected: selected
        });

        this.props.onChange(this.state.selected.text, this.state.selected);
        this.close();
    }
    clickBody(e) {
        if (!this.state.open) {
            return;
        }

        var target = e.target;
        if (target.className.indexOf('materialSelect') == -1) {
            var lastParent = target.parentElement;

            while (lastParent) {
                if (lastParent.className.indexOf('materialSelect') != -1) {
                    target = lastParent;
                    break;
                }

                lastParent = lastParent.parentElement;
            }
        }

        if (target != this.wrapper) {
            this.close();
        }
    }
    componentWillMount() {
        this.parseOptions(this.state.options);
    }
    componentDidMount() {
        window.addEventListener('mouseup', this.clickBody);
        window.addEventListener('touchend', this.clickBody);
    }
    componentWillUnmount() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        window.removeEventListener('mouseup', this.clickBody);
        window.removeEventListener('touchend', this.clickBody);
    }
    componentWillReceiveProps(newProps) {
        if (newProps.options) {
            this.parseOptions(newProps.options);
        }
    }
    render() {
        var wrapperClasses = classnames(this.props.className, {
            materialSelect: true,
            inline: this.props.inline,
            error: this.state.error,
            empty: this.state.empty,
            animate: this.props.animation
        });
        var wrapperStyle = {
            width: this.props.inline ? this.props.width : false
        };
        var selectClasses = classnames({
            select: true,
            open: this.state.open,
            onTop: this.state.onTop
        });
        var optionsNumber = this.state.options.length - (this.state.placeholder && this.props.required ? 1 : 0);
        var height = !this.state.open ? this.props.height : Math.min(optionsNumber * this.props.height, 5 * this.props.height);

        var selectStyle = {};

        if (this.state.open) {
            var padding = 5;
            var offset = Select.cumulativeOffset(this.wrapper);
            var currentY = offset.top - window.scrollY; // relative to scrolled window

            var transformY = (this.props.height - height) / 2;

            if (height > window.innerHeight) {
                height = window.innerHeight - padding * 2;
            }

            if (transformY + currentY < padding) {
                transformY = -currentY + padding;
            }
            else if (currentY + transformY + height > window.innerHeight - padding) {
                transformY = -currentY - height + (window.innerHeight - padding);
            }

            selectStyle.transform = `translate(0, ${transformY}px)`;
            selectStyle.overflow = 'auto';
        }
        selectStyle.height = height;

        var content;
        if (this.state.onTop) {
            content = this.state.options.map((option, key) => {
                var classes = classnames({
                    selected: this.state.selected.key == key,
                    hidden: option.placeholder && this.props.required
                });

                return (
                    <Button
                        flat
                        wrapperElem='li'
                        onClick={this.clickLi.bind(this, key)}
                        className={classes}
                        key={key}>
                        {option.text}
                    </Button>
                );
            });
        }
        else if (this.state.selected) {
            content = (
                <Button
                    flat
                    wrapperElem='li'
                    className="selected"
                    key={this.state.selected.key}>
                    {this.state.selected.text}
                </Button>
            );
        }

        return (
            <Button
                ripple={false}
                className={wrapperClasses}
                style={wrapperStyle}
                onClick={this.open}
                ref={wrapper => this.wrapper = wrapper && wrapper.button}>
                <ul
                    className={selectClasses}
                    style={selectStyle}
                    ref={select => this.select = select}>
                    {
                        content
                    }
                </ul>
                <div className="message">{this.state.message}</div>
            </Button>
        );
    }
}

export default Select;