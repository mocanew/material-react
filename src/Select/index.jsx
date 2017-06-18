import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import smoothscroll from 'smoothscroll';
import classnames from 'classnames';
import './index.scss';

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

        this.validator = _.isFunction(props.validator) ? props.validator : this.defaultValidator.bind(this);
        this.onChange = _.isFunction(props.onChange) ? props.onChange : () => { };

        this.parseOptions = this.parseOptions.bind(this);
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.clickLi = this.clickLi.bind(this);
        this.clickBody = this.clickBody.bind(this);
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
    defaultValidator(e) {
        e = e.text;
        return e && e.length <= 0;
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
            error: this.validator(this.state.selected.text) || (this.state.required && this.state.selected == this.state.placeholder)
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
    clickLi(e) {
        if (!e.target || !e.target.attributes['data-id']) return;
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
        var target = e.target;
        if (e.target.className.indexOf('materialSelect') == -1) {
            var parents = getParents(e.target, '.materialSelect');
            var last = parents[parents.length - 1];
            if (last && last.className.indexOf('materialSelect') != -1) target = last;
        }
        if (target == this.wrapper) this.open();
        else this.close();
    }
    componentDidMount() {
        window.addEventListener('click', this.clickBody);
        this.wrapper.addEventListener('click', this.clickLi);
    }
    componentWillUnmount() {
        window.removeEventListener('click', this.clickBody);
        this.wrapper.removeEventListener('click', this.clickLi);
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
                    return '';
                }

                return <li className={this.state.selected.key == key ? 'selected' : ''} data-id={key} key={key}>{option.text}</li>;
            });
        }
        else if (this.state.selected) {
            content = <li className="selected" data-id={this.state.selected.key}>{this.state.selected.text}</li>;
        }

        return (
            <div
                className={wrapperClasses}
                style={wrapperStyle}
                ref={wrapper => this.wrapper = wrapper}>
                <ul
                    className={selectClasses}
                    style={selectStyle}
                    ref={select => this.select = select}>
                    {
                        content
                    }
                </ul>
                <div className="message">{this.state.message}</div>
            </div>
        );
    }
}

export default Select;