import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import smoothscroll from 'smoothscroll';
import classnames from 'classnames';
import './index.scss';

import Button from '../Button/';

function getParents(el, parentSelector) {
    var parents = [];
    var p = el.parentElement;

    while (p && (!parentSelector || p.parentElement.querySelector(parentSelector) == null)) {
        var o = p;
        parents.push(o);
        p = o.parentElement;
    }
    if (p) parents.push(p);

    return parents;
}

class Select extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        options: PropTypes.array,
        height: PropTypes.number,
        animation: PropTypes.bool,
        inline: PropTypes.bool,
        open: PropTypes.bool,
        required: PropTypes.bool,
        message: PropTypes.string,
        onChange: PropTypes.func,
        validator: PropTypes.func
    }
    static defaultProps = {
        onChange: () => { },
        validator: Select.defaultValidator
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

        this.parseOptions(state.options, state);
        this.state = state;

        this.parseOptions = this.parseOptions.bind(this);
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.clickBody = this.clickBody.bind(this);
    }
    parseOptions(options, state) {
        _.each(options, (value, key) => {
            if (!_.isObject(value)) {
                value = {
                    text: value
                };
            }
            var selected = this.state ? !this.state.selected : !state.selected;
            if (selected && value.placeholder) {
                if (state) {
                    state.selected = value;
                    state.placeholder = value;
                }
                else {
                    this.setState({
                        placeholder: value,
                        selected: value
                    });
                }
            }
            if (value.selected) {
                if (state) {
                    state.selected = value;
                }
                else {
                    this.setState({
                        selected: value
                    });
                }
            }
            value.key = key;

            options[key] = value;
        });
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
        }, this.state.animationDuration);
        this.setState({
            open: false
        });
        smoothscroll(0, this.state.animationDuration, null, this.select);

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

        var pos = Math.max((this.state.options.indexOf(this.state.selected) - 2) * this.state.height, 0);

        smoothscroll(pos, this.state.animationDuration, null, this.select);
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
        var target = e.target;
        if (e.target.className.indexOf('materialSelect') == -1) {
            var parents = getParents(e.target, '.materialSelect');
            var last = parents[parents.length - 1];
            if (last && last.className.indexOf('materialSelect') != -1) target = last;
        }

        if (target != this.wrapper && this.state.open) {
            this.close();
        }
    }
    componentDidMount() {
        window.addEventListener('mouseup', this.clickBody);
        window.addEventListener('touchend', this.clickBody);
    }
    componentWillUnmount() {
        window.removeEventListener('mouseup', this.clickBody);
        window.removeEventListener('touchend', this.clickBody);
    }
    componentWillReceiveProps(newProps) {
        if (newProps.options) {
            this.setState({
                options: this.parseOptions(newProps.options)
            });
        }
    }
    render() {
        var wrapperClasses = classnames(this.props.className, {
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
        var optionsNumber = this.state.options.length - (this.state.placeholder && this.state.required ? 1 : 0);
        var height = !this.state.open ? this.state.height : Math.min(optionsNumber * this.state.height, 5 * this.state.height);

        var selectStyle = {};

        if (this.state.open) {
            var padding = 5;
            var offset = Select.cumulativeOffset(this.wrapper);
            var currentY = offset.top - window.scrollY; // relative to scrolled window

            var transformY = (this.state.height - height) / 2;

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
                if (option.placeholder && this.state.required) {
                    return null;
                }

                return (
                    <Button
                        flat
                        wrapperElem='li'
                        onClick={this.clickLi.bind(this, key)}
                        className={this.state.selected.key == key ? 'selected' : ''}
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