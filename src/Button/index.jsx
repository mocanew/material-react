import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './index.scss';

class MaterialButton extends React.Component {
    static propTypes = {
        style: PropTypes.object,
        className: PropTypes.string,
        children: PropTypes.node,
        toggleOffClass: PropTypes.string,
        toggleOnClass: PropTypes.string,
        onClick: PropTypes.func,
        raised: PropTypes.bool,
        flat: PropTypes.bool,
        ripple: PropTypes.bool
    }
    static defaultProps = {
        ripple: true
    }
    constructor(props) {
        super(props);
        this.state = {
            ripples: [],
            toggleState: false
        };
        this.rippleTimeouts = [];

        this.onMouseDown = this.onMouseDown.bind(this);
        this.updateRipple = this.updateRipple.bind(this);
        this.findFreeRipple = this.findFreeRipple.bind(this);
        this.createRipple = this.createRipple.bind(this);
        this.onClick = this.onClick.bind(this);
    }
    onClick(e) {
        if (typeof this.props.onClick == 'function') this.props.onClick(e);
        this.setState({
            toggleState: !this.state.toggleState
        });
    }
    updateRipple(e, index) {
        var ripple = this.state.ripples[index];

        ripple.done = false;
        ripple.size = e.size;
        ripple.top = e.top;
        ripple.left = e.left;

        this.forceUpdate();
        var timeoutID = setTimeout(() => {
            this.rippleTimeouts.splice(this.rippleTimeouts.indexOf(timeoutID), 1);
            ripple.done = true;
            this.forceUpdate();
        }, 1000);
        this.rippleTimeouts.push(timeoutID);
    }
    createRipple(callback) {
        var ripples = this.state.ripples.concat([]);
        ripples.push({
            size: 0,
            top: 0,
            left: 0,
            done: true
        });
        this.setState({
            ripples: ripples
        }, () => callback(this.state.ripples.length - 1));
    }
    findFreeRipple(callback) {
        var i = 0;
        if (!this.state.ripples.length) {
            return this.createRipple(callback);
        }

        for (i = 0; i < this.state.ripples.length; i++) {
            if (this.state.ripples[i].done == true) {
                return callback(i);
            }
        }
        this.createRipple(callback);
    }
    onMouseDown(event) {
        event.stopPropagation();
        var page = {
            x: event.pageX,
            y: event.pageY
        };
        if (this.props.ripple) {
            var maxWidthHeight = Math.max(this.refs.button.offsetWidth, this.refs.button.offsetWidth);

            this.findFreeRipple((i) => {
                var rect = this.refs.button.getBoundingClientRect();
                var x = page.x - window.scrollX - maxWidthHeight / 2 - rect.left;
                var y = page.y - window.scrollY - maxWidthHeight / 2 - rect.top;

                this.updateRipple({
                    size: maxWidthHeight,
                    top: y,
                    left: x
                }, i);
            });
        }
    }
    componentWillUnmount() {
        this.rippleTimeouts.forEach(timeoutID => {
            clearTimeout(timeoutID);
        });
        this.rippleTimeouts = [];
    }
    render() {
        var toggleClass = this.state.toggleState ? this.props.toggleOffClass : this.props.toggleOnClass;
        var classes = classnames(this.props.className, 'materialButton', {
            flat: this.props.flat,
            raised: this.props.raised
        }, toggleClass);
        return (
            <div className={classes} style={this.props.style} onMouseDown={this.onMouseDown} onClick={this.onClick} ref="button">
                {this.state.ripples.map((e, index) => {
                    var classes = classnames({
                        ripple: true,
                        animate: e.done == false
                    });
                    var style = {
                        width: e.size,
                        height: e.size,
                        top: e.top,
                        left: e.left
                    };
                    return <b className={classes} style={style} key={index} ></b>;
                })}
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