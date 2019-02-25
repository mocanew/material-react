import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './index.scss';

class RippleController extends React.PureComponent {
    static propTypes = {
        rippleDuration: PropTypes.number,
        disabled: PropTypes.bool,
    }
    static defaultProps = {
        rippleDuration: 1000,
        disabled: false,
    }
    static defaultRipple = {
        id: undefined,
        x: 0,
        y: 0,
        size: 0,
        canceled: false,
        focus: false,
        ending: false,
        finished: true,
        startAnimationDuration: 500,
        cancelAnimationDuration: 200,
        focusAnimationDuration: 1000,
        endAnimationDuration: 500,
        timeoutID: undefined,
        startTimeoutID: undefined,
        renderedOnce: false,
    }
    constructor() {
        super();

        this.rippleCount = 0;
        this.ripples = {};
        this.renderedRipples = {};
        this.rippleIDs = [];
        this.touches = {};
        this.timeouts = [];

        this.startRippleAt = this.startRippleAt.bind(this);
        this.createRipple = this.createRipple.bind(this);
        this.findFreeRipple = this.findFreeRipple.bind(this);
        this.updateRipple = this.updateRipple.bind(this);
        this.endRippleAnimation = this.endRippleAnimation.bind(this);
        this.endRipple = this.endRipple.bind(this);
        this.updateRippleRender = this.renderRipple.bind(this);

        this.onCursorDown = this.onCursorDown.bind(this);
        this.onCursorUp = this.onCursorUp.bind(this);
    }
    componentWillUnmount() {
        var i;
        for (i = 0; i < this.timeouts.length; i++) {
            clearTimeout(this.timeouts[i]);
        }
        for (i = 0; i < this.rippleIDs; i++) {
            var ripple = this.ripples[i];
            if (ripple.timeoutID) {
                clearTimeout(ripple.timeoutID);
            }
            if (ripple.startTimeoutID) {
                clearTimeout(ripple.startTimeoutID);
            }
        }
        this.unmounted = true;
    }
    createRipple() {
        var id = this.rippleCount++;

        this.ripples[id] = Object.assign({}, RippleController.defaultRipple);
        this.ripples[id].id = id;

        this.rippleIDs.push(id);
        return this.ripples[id];
    }
    findFreeRipple() {
        for (var i = 0; i < this.rippleIDs.length; i++) {
            if (this.ripples[this.rippleIDs[i]].finished) {
                return this.ripples[this.rippleIDs[i]];
            }
        }
        return this.createRipple();
    }
    endRippleAnimation(ripple) {
        ripple.timeoutID = setTimeout(() => {
            ripple.timeoutID = undefined;
            ripple.renderedOnce = false;
            ripple.ending = false;
            ripple.finished = true;
            this.renderRipple(ripple);
        }, ripple.endAnimationDuration);
    }
    updateRipple(newRipple) {
        var ripple = this.findFreeRipple();

        Object.assign(ripple, newRipple);
        if (typeof newRipple.endAnimationDuration != 'number' || newRipple.endAnimationDuration < 0) {
            ripple.endAnimationDuration = RippleController.defaultRipple.endAnimationDuration;
        }
        if (typeof newRipple.startAnimationDuration != 'number' || newRipple.startAnimationDuration < 0) {
            ripple.startAnimationDuration = RippleController.defaultRipple.startAnimationDuration;
        }
        ripple.starting = true;
        ripple.finished = false;
        ripple.ending = false;
        ripple.canceled = false;

        this.renderRipple(ripple);

        if (ripple.focus) {
            ripple.startTimeoutID = setTimeout(() => {
                ripple.startTimeoutID = undefined;
                ripple.starting = false;
                this.renderRipple(ripple);
            }, ripple.startAnimationDuration);
        }
        else {
            this.endRippleAnimation(ripple);
        }
        return ripple;
    }
    startRippleAt(options) {
        var x, y;
        if (this.props.disabled) {
            return;
        }

        var rect = options.parent.getBoundingClientRect();
        if (options.size) {
            size = options.size;
        }
        else {
            size = Math.max(options.parent.offsetWidth, options.parent.offsetHeight);
        }

        if (options.center) {
            x = -(size - rect.width) / 2;
            y = -(size - rect.height) / 2;
        }
        else {
            var size;
            x = options.x - window.scrollX - size / 2 - rect.left;
            y = options.y - window.scrollY - size / 2 - rect.top;
        }

        var ripple = this.updateRipple({
            x: x,
            y: y,
            size: size,
            focus: options.focus,
        });
        var touchID = options.touchID || 0;
        this.touches[touchID] = ripple;
        return ripple;
    }
    endRipple(touchID, cancel) {
        touchID = touchID || 0;
        var ripple = this.touches[touchID];

        if (ripple && !ripple.finished && !ripple.ending) {
            ripple.starting = false;
            if (ripple.startTimeoutID) {
                clearTimeout(ripple.startTimeoutID);
            }

            ripple.ending = true;
            ripple.canceled = cancel;
            this.renderRipple(ripple);
            this.endRippleAnimation(ripple);
            return ripple;
        }
    }
    renderRipple(ripple) {
        var style = {
            display: ripple.finished ? 'none' : 'block',
            width: ripple.size,
            height: ripple.size,
            top: ripple.y,
            left: ripple.x,
        };
        var innerStyle = {
            animationDuration: ripple.focusAnimationDuration + 'ms',
        };

        var classes = 'ripple';
        if (!ripple.finished) {
            if (ripple.renderedOnce) {
                classes = classnames({
                    ripple: true,
                    focus: ripple.focus && !ripple.starting && !ripple.ending && !ripple.canceled,
                    canceled: ripple.focus && ripple.canceled,
                    starting: ripple.focus && ripple.starting,
                    ending: ripple.focus && ripple.ending,
                });

                if (ripple.focus && ripple.ending && this.lastClasses.indexOf('focus') == -1) {
                    style.transitionTimingFunction = 'ease-out';
                }
                if (ripple.starting) {
                    style.transitionDuration = ripple.startAnimationDuration;
                }
                if (ripple.canceled) {
                    style.transitionDuration = ripple.cancelAnimationDuration;
                }
                if (ripple.ending) {
                    style.transitionDuration = ripple.endAnimationDuration;
                }
                style.transitionDuration += 'ms';
            }
            else {
                this.timeouts.push(setTimeout(() => {
                    ripple.renderedOnce = true;
                    this.renderRipple(ripple);
                }));
            }
        }
        this.lastClasses = classes;

        this.renderedRipples[ripple.id] = (
            <span className={classes} style={style} key={ripple.id}>
                <span className="innerRipple" style={innerStyle} />
            </span>
        );
        if (!this.unmounted) {
            this.forceUpdate();
        }
    }
    onCursorDown(options) {
        return this.startRippleAt(options);
    }
    onCursorUp(options) {
        options = options || {};
        return this.endRipple(options.touchID, options.cancel);
    }
    render() {
        return (
            <span>
                {
                    this.rippleIDs.map((rippleID) => this.renderedRipples[rippleID])
                }
            </span>
        );
    }
}

export default RippleController;