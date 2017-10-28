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
        icon: PropTypes.string,
        raised: PropTypes.bool,
        flat: PropTypes.bool,
        ripple: PropTypes.bool,
        disabled: PropTypes.bool,
        wrapperElem: PropTypes.node,
        loading: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
            PropTypes.number
        ]),
        touchDelta: PropTypes.number
    }
    static defaultProps = {
        wrapperElem: 'div',
        ripple: true,
        flat: false,
        raised: false,
        loading: false,
        touchDelta: 10,
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
            ripples: [],
            touchDelta: props.touchDelta
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
        this.mousedDown = true;
    }
    onMouseUp(e) {
        if (window.materialButtonTouch) {
            return;
        }

        if (this.props.ripple) {
            this.rippleController.onCursorUp();
        }
        if (!this.mousedDown) {
            return;
        }
        this.mousedDown = false;

        this.props.onClick(e);
    }
    onMouseCancel() {
        this.mousedDown = false;
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
        this.scroll = {
            x: window.scrollX,
            y: window.scrollY
        };
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
        this.scroll = undefined;
    }
    onTouchEnd(e) {
        if (!this.scroll) {
            return;
        }

        var delta = Math.abs(window.scrollX - this.scroll.x) + Math.abs(window.scrollY - this.scroll.y);
        this.scroll = undefined;
        console.log(delta);

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

                if (delta <= this.state.touchDelta) {
                    this.props.onClick(e);
                }
            }
        }
        this.touches = touches;
    }
    render() {
        var loading = this.props.loading === 0 ? '0' : this.props.loading;
        if (loading) {
            var indeterminate;
            if (typeof this.props.loading != 'boolean' && !isNaN(Number(this.props.loading))) {
                indeterminate = false;
            }
            else {
                indeterminate = true;
            }
        }

        var classes = classnames(this.props.className, 'materialButton', {
            flat: this.props.flat,
            raised: this.props.raised,
            icon: this.props.icon,
            disabled: this.props.disabled,
            'materialButton--loading': loading
        }, this.props.icon, {
                'materialButton--indeterminate': loading && indeterminate,
                'materialButton--determinate': loading && !indeterminate
            });

        var progress;
        var loaderStyle = {};
        if (!indeterminate) {
            progress = Number(this.props.loading);
            if (progress >= 0 && progress <= 1) {
                progress = progress * 100;
            }

            loaderStyle = {
                width: progress + '%'
            };
        }

        var eventListeners;
        if (!this.props.disabled) {
            eventListeners = {
                onMouseDown: this.onMouseDown,
                onMouseUp: this.onMouseUp,
                onMouseLeave: this.onMouseCancel,
                onDragLeave: this.onMouseCancel,
                onDrop: this.onMouseCancel,
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
                        : null
                }
                {
                    loading ?
                        <div className="materialButton__loader">
                            <div className="materialButton__loaderHighlight" style={loaderStyle}></div>
                        </div>
                        : null
                }
                {this.props.children}
                {
                    this.props.icon ?
                        <span className="icon">
                            <span className="s1"></span>
                            <span className="s2"></span>
                            <span className="s3"></span>
                        </span> : null
                }
            </Elem>
        );
    }
}

export default Button;