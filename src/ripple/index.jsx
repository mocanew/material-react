import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './index.scss';

class RippleController extends React.PureComponent {
    static propTypes = {
        rippleDuration: PropTypes.number
    }
    static defaultProps = {
        rippleDuration: 1000
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
        focusAnimationDuration: 1000,
        touchEndAnimationDuration: 500,
        timeoutID: undefined,
        startTimeoutID: undefined,
        renderedOnce: false
    }
    constructor() {
        super();

        this.rippleCount = 0;
        this.ripples = {};
        this.rippleIDs = [];
        this.touches = {};
        this.timeouts = [];

        this.startRippleAt = this.startRippleAt.bind(this);
        this.createRipple = this.createRipple.bind(this);
        this.findFreeRipple = this.findFreeRipple.bind(this);
        this.updateRipple = this.updateRipple.bind(this);
        this.endRippleAnimation = this.endRippleAnimation.bind(this);
        this.endRipple = this.endRipple.bind(this);

        this.onCursorDown = this.onCursorDown.bind(this);
        this.onCursorUp = this.onCursorUp.bind(this);
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
            this.forceUpdate();
        }, ripple.touchEndAnimationDuration);
    }
    updateRipple(newRipple, animationDuration) {
        // console.log('update', newRipple, animationDuration);
        var ripple = this.findFreeRipple();

        ripple.x = newRipple.x;
        ripple.y = newRipple.y;
        ripple.size = newRipple.size;
        ripple.focus = newRipple.focus;
        ripple.touchEndAnimationDuration = animationDuration >= 0 ? animationDuration : RippleController.defaultRipple.touchEndAnimationDuration;
        ripple.finished = false;
        ripple.ending = false;
        ripple.starting = true;
        ripple.canceled = false;

        this.forceUpdate();

        if (newRipple.focus) {
            ripple.startTimeoutID = setTimeout(() => {
                ripple.startTimeoutID = undefined;
                ripple.starting = false;
                this.forceUpdate();
            }, ripple.touchEndAnimationDuration);
        }
        else {
            this.endRippleAnimation(ripple);
        }
        return ripple;
    }
    startRippleAt(options) {
        var x = options.x - window.scrollX - options.size / 2 - options.rect.left;
        var y = options.y - window.scrollY - options.size / 2 - options.rect.top;

        var ripple = this.updateRipple({
            x: x,
            y: y,
            size: options.size,
            focus: options.focus
        });
        var touchID = options.touchID || 0;
        // if (this.touches[touchID]) {
        //     this.endRipple(touchID);
        // }
        this.touches[touchID] = ripple;
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
            this.forceUpdate();
            this.endRippleAnimation(ripple);
        }
    }
    onCursorDown(options) {
        this.startRippleAt(options);
    }
    onCursorUp(cancel, touchID) {
        this.endRipple(touchID, cancel);
    }
    render() {
        return (
            <span>
                {
                    this.rippleIDs.map((rippleID) => {
                        var ripple = this.ripples[rippleID];
                        var style = {
                            display: ripple.finished ? 'none' : 'block',
                            width: ripple.size,
                            height: ripple.size,
                            top: ripple.y,
                            left: ripple.x,
                        };
                        var innerStyle = {
                            animationDuration: ripple.focusAnimationDuration + 'ms'
                        };

                        var classes = 'ripple';
                        if (!ripple.finished) {
                            if (ripple.renderedOnce) {
                                classes = classnames({
                                    ripple: true,
                                    focus: ripple.focus && !ripple.starting && !ripple.ending && !ripple.canceled,
                                    canceled: ripple.focus && ripple.canceled,
                                    starting: ripple.focus && ripple.starting,
                                    ending: ripple.focus && ripple.ending
                                });
                                style.transitionDuration = ripple.touchEndAnimationDuration + 'ms';
                            }
                            else {
                                this.timeouts.push(setTimeout(() => {
                                    ripple.renderedOnce = true;
                                    this.forceUpdate();
                                }));
                            }
                        }

                        return (
                            <span className={classes} style={style} key={rippleID}>
                                <span className="innerRipple" style={innerStyle} />
                            </span>
                        );
                    })
                }
            </span>
        );
    }
}

export default RippleController;