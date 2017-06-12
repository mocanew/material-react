import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import RippleController from '../ripple/';
import './index.scss';

class MaterialButton extends React.Component {
    static propTypes = {
        style: PropTypes.object,
        className: PropTypes.string,
        children: PropTypes.node,
        onClick: PropTypes.func,
        raised: PropTypes.bool,
        flat: PropTypes.bool,
        ripple: PropTypes.bool
    }
    static defaultProps = {
        ripple: true,
        flat: false,
        raised: false,
        onClick: () => { }
    }
    constructor(props) {
        super(props);
        this.state = {
            ripples: []
        };

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
        this.rippleController.onCursorDown({
            x: e.pageX,
            y: e.pageY,
            parent: this.button,
            focus: true
        });
    }
    onMouseUp() {
        this.rippleController.onCursorUp();
    }
    onMouseCancel() {
        this.rippleController.onCursorUp({
            cancel: true
        });
    }
    onTouchStart(e) {
        if (!e || !e.targetTouches || !e.targetTouches.length) {
            return;
        }
        e.persist();
        console.log(e.targetTouches);
        var touches = e.targetTouches;
        this.touchID = touches[0].identifier;
        this.touchStart = {
            x: touches[0].pageX,
            y: touches[0].pageY
        };
        this.rippleController.onCursorDown({
            x: touches[0].pageX,
            y: touches[0].pageY,
                parent: this.button,
                focus: true
        });
    }
    onTouchCancel() {
        this.rippleController.onCursorUp({
            cancel: true
        });
    }
    onTouchEnd(e) {
        this.rippleController.onCursorUp();
        e.persist();
        console.log(e.targetTouches);
    }
    render() {
        var classes = classnames(this.props.className, 'materialButton', {
            flat: this.props.flat,
            raised: this.props.raised
        });
        var eventListeners;
        if (this.props.ripple) {
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

        return (
            <div
                style={this.props.style}
                className={classes}
                {...eventListeners}
                ref={(button) => {
                    this.button = button;
                }}>
                {
                    this.props.ripple ?
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
                        <span>
                            <span className="s1"></span>
                            <span className="s2"></span>
                            <span className="s3"></span>
                        </span> : ''
                }
            </div>
        );
    }
}

export default MaterialButton;