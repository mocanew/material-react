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
        this.rippleTimeouts = [];

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
    // onClick(e) {
    //     if (typeof this.props.onClick == 'function') this.props.onClick(e);
    //     this.setState({
    //         toggleState: !this.state.toggleState
    //     });
    // }
    componentDidUpdate() {
        console.log('update');
        this.buttonRect = this.button.getBoundingClientRect();
        this.size = Math.max(this.button.offsetWidth, this.button.offsetWidth);
    }
    onMouseDown(e) {
        this.ripples.onCursorDown({
            x: e.pageX,
            y: e.pageY,
            size: this.size,
            rect: this.buttonRect,
            focus: true
        });
    }
    onMouseUp() {
        this.ripples.onCursorUp();
    }
    onMouseCancel() {
        this.ripples.onCursorUp(true);
    }
    onTouchStart(e) {
        if (!e || !e.targetTouches || !e.targetTouches.length) {
            return;
        }
        e.persist();
        var touches = e.targetTouches;
        this.touchID = touches[0].identifier;
        // console.log(touches[0]);
        this.touchStart = {
            x: touches[0].pageX,
            y: touches[0].pageY
        };
        this.ripples.onCursorDown({
            x: touches[0].pageX,
            y: touches[0].pageY,
            size: this.size,
            rect: this.buttonRect,
            focus: true
        });
    }
    onTouchCancel() {
        this.ripples.onCursorUp(true);
    }
    onTouchEnd(e) {
        this.ripples.onCursorUp();
        e.stopPropagation();
        if (!e || !e.targetTouches || !e.targetTouches.length) {
            return;
        }
        var touches = e.targetTouches;
        if (touches.indexOf(this.touchID)) {
            this.touchID = undefined;
            this.touchStart = undefined;
        }
    }
    componentWillUnmount() {
        this.rippleTimeouts.forEach(timeoutID => {
            clearTimeout(timeoutID);
        });
        this.rippleTimeouts = [];
    }
    render() {
        var classes = classnames(this.props.className, 'materialButton', {
            flat: this.props.flat,
            raised: this.props.raised
        });

        return (
            <div
                style={this.props.style}
                className={classes}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
                onMouseLeave={this.onMouseCancel}
                onTouchStart={this.onTouchStart}
                onTouchCancel={this.onTouchCancel}
                onTouchEnd={this.onTouchEnd}
                ref={(button) => {
                    this.button = button;
                }}>
                {
                    this.props.ripple ?
                        <RippleController
                            ref={(ripples) => {
                                this.ripples = ripples;
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