import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import RippleController from '../ripple/';
import './index.scss';

class Checkbox extends React.Component {
    static propTypes = {
        style: PropTypes.object,
        className: PropTypes.string,
        children: PropTypes.node,
        onCheck: PropTypes.func,
        raised: PropTypes.bool,
        flat: PropTypes.bool,
        ripple: PropTypes.bool,
        disabled: PropTypes.bool,
        wrapperElem: PropTypes.node,
        iconClass: PropTypes.string,
        checked: PropTypes.bool,
    }
    static defaultProps = {
        checked: true,
        wrapperElem: 'div',
        ripple: true,
        flat: false,
        raised: false,
        onCheck: () => { },
    }
    static getTouchIDs(touches) {
        var result = [];
        for (var i = 0; i < touches.length; i++) {
            result.push(touches[i].identifier);
        }
        return result;
    }
    constructor(props) {
        super(props);
        this.state = {
            ripples: [],
            checked: props.checked,
        };
        this.touches = [];

        var functionsToBind = [
            'onMouseDown',
            'onMouseUp',
            'onMouseCancel',
            'onTouchStart',
            'onTouchCancel',
            'onTouchEnd',
        ];
        functionsToBind.forEach(fn => {
            this[fn] = this[fn].bind(this);
        });
    }
    onMouseDown() {
        if (window.materialButtonTouch) {
            return;
        }

        if (this.props.ripple) {
            this.rippleController.onCursorDown({
                center: true,
                parent: this.button,
                focus: true,
                size: 48,
            });
        }
    }
    onMouseUp(e) {
        if (window.materialButtonTouch) {
            return;
        }

        if (this.props.ripple) {
            this.rippleController.onCursorUp();
        }
        this.setState({
            checked: !this.state.checked,
        });
        this.props.onCheck(e);
    }
    onMouseCancel() {
        if (window.materialButtonTouch) {
            return;
        }

        if (this.props.ripple) {
            this.rippleController.onCursorUp({
                cancel: true,
            });
        }
    }
    onTouchStart(e) {
        if (!e || !e.targetTouches || !e.targetTouches.length) {
            return;
        }
        var touches = Checkbox.getTouchIDs(e.targetTouches);

        for (var i = 0; i < touches.length; i++) {
            if (!this.props.ripple || this.touches.indexOf(touches[i]) >= 0) {
                continue;
            }

            this.rippleController.onCursorDown({
                touchID: touches[i],
                center: true,
                size: 48,
                parent: this.button,
                focus: true,
            });
        }
        this.touches = touches;
    }
    onTouchCancel(e) {
        var touches = Checkbox.getTouchIDs(e.targetTouches);

        for (var i = 0; i < this.touches.length; i++) {
            if (this.props.ripple && touches.indexOf(this.touches[i]) == -1) {
                this.rippleController.onCursorUp({
                    touchID: this.touches[i],
                    cancel: true,
                });
            }
        }
        this.touches = touches;
    }
    onTouchEnd(e) {
        if (window.materialButtonClickTimeout) {
            clearTimeout(window.materialButtonClickTimeout);
        }
        window.materialButtonTouch = true;
        window.materialButtonClickTimeout = setTimeout(() => {
            window.materialButtonTouch = false;
        }, 1000);
        var touches = Checkbox.getTouchIDs(e.targetTouches);

        for (var i = 0; i < this.touches.length; i++) {
            if (touches.indexOf(this.touches[i]) == -1) {
                if (this.props.ripple) {
                    this.rippleController.onCursorUp({
                        touchID: this.touches[i],
                    });
                }
                this.setState({
                    checked: !this.state.checked,
                });
                this.props.onCheck(e);
            }
        }
        this.touches = touches;
    }
    static getDerivedStateFromProps(newProps) {
        if (newProps.checked !== undefined) {
            return {
                checked: newProps.checked,
            };
        }
    }
    render() {
        var classes = classnames(this.props.className, 'materialCheckbox', {
            disabled: this.props.disabled,
            checked: this.state.checked,
        });
        var iconClasses = classnames({
            fa: true,
            'fa-check': !this.props.iconClass,
            [this.props.iconClass]: this.props.iconClass,
        });
        var eventListeners;
        if (!this.props.disabled) {
            eventListeners = {
                onMouseDown: this.onMouseDown,
                onMouseUp: this.onMouseUp,
                onMouseLeave: this.onMouseCancel,
                onTouchStart: this.onTouchStart,
                onTouchCancel: this.onTouchCancel,
                onTouchEnd: this.onTouchEnd,
            };
        }
        else {
            eventListeners = {};
        }
        var Elem = this.props.wrapperElem;

        return (
            <Elem
                style={this.props.style}
                className={classes}
                {...eventListeners}
                ref={(button) => {
                    this.button = button;
                }}>
                {
                    this.props.ripple && !this.props.disabled ?
                        <RippleController
                            ref={(ripples) => {
                                this.rippleController = ripples;
                            }}
                        />
                        : ''
                }
                <i className={iconClasses} />
            </Elem>
        );
    }
}

export default Checkbox;