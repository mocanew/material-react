import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import RippleController from '../ripple/';
import './index.scss';

class Button extends React.Component {
    static propTypes = {
        style: PropTypes.object,
        className: PropTypes.string,
        children: PropTypes.node,
        onClick: PropTypes.func,
        raised: PropTypes.bool,
        flat: PropTypes.bool,
        ripple: PropTypes.bool,
        disabled: PropTypes.bool,
        wrapperElem: PropTypes.node
    }
    static defaultProps = {
        wrapperElem: 'div',
        ripple: true,
        flat: false,
        raised: false,
        onClick: () => { }
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
            ripples: []
        };
        this.touches = [];

        var functionsToBind = [
            'onMouseDown',
            'onMouseUp',
            'onMouseCancel',
            'onTouchStart',
            'onTouchCancel',
            'onTouchEnd'
        ];
        functionsToBind.forEach(fn => {
            this[fn] = this[fn].bind(this);
        });
    }
    onMouseDown(e) {
        if (window.materialButtonTouch) {
            return;
        }

        if (this.props.ripple) {
            this.rippleController.onCursorDown({
                x: e.pageX,
                y: e.pageY,
                parent: this.button,
                focus: true
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
        this.props.onClick(e);
    }
    onMouseCancel() {
        if (window.materialButtonTouch) {
            return;
        }

        if (this.props.ripple) {
            this.rippleController.onCursorUp({
                cancel: true
            });
        }
    }
    onTouchStart(e) {
        if (!e || !e.targetTouches || !e.targetTouches.length) {
            return;
        }
        var touches = Button.getTouchIDs(e.targetTouches);

        for (var i = 0; i < touches.length; i++) {
            if (!this.props.ripple || this.touches.indexOf(touches[i]) >= 0) {
                continue;
            }

            this.rippleController.onCursorDown({
                touchID: touches[i],
                x: e.targetTouches[i].pageX,
                y: e.targetTouches[i].pageY,
                parent: this.button,
                focus: true
            });
        }
        this.touches = touches;
    }
    onTouchCancel(e) {
        var touches = Button.getTouchIDs(e.targetTouches);

        for (var i = 0; i < this.touches.length; i++) {
            if (this.props.ripple && touches.indexOf(this.touches[i]) == -1) {
                this.rippleController.onCursorUp({
                    touchID: this.touches[i],
                    cancel: true
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
        var touches = Button.getTouchIDs(e.targetTouches);

        for (var i = 0; i < this.touches.length; i++) {
            if (touches.indexOf(this.touches[i]) == -1) {
                if (this.props.ripple) {
                    this.rippleController.onCursorUp({
                        touchID: this.touches[i]
                    });
                }
                this.props.onClick(e);
            }
        }
        this.touches = touches;
    }
    render() {
        var classes = classnames(this.props.className, 'materialButton', {
            flat: this.props.flat,
            raised: this.props.raised,
            disabled: this.props.disabled
        });
        var eventListeners;
        if (!this.props.disabled) {
            eventListeners = {
                onMouseDown: this.onMouseDown,
                onMouseUp: this.onMouseUp,
                onMouseLeave: this.onMouseCancel,
                onTouchStart: this.onTouchStart,
                onTouchCancel: this.onTouchCancel,
                onTouchEnd: this.onTouchEnd
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
                {this.props.children}
                {
                    classes.indexOf('iconBtn') >= 0 ?
                        <span className="icon">
                            <span className="s1"></span>
                            <span className="s2"></span>
                            <span className="s3"></span>
                        </span> : ''
                }
            </Elem>
        );
    }
}

export default Button;