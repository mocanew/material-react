import React from 'react';
import './index.scss';
const classNames = require('classnames');

class MaterialButton extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            drop: true,
            drops: [],
            toggleState: false
        };
        this.onMouseDown = this.onMouseDown.bind(this);
        this.updateDrop = this.updateDrop.bind(this);
        this.findFreeDrop = this.findFreeDrop.bind(this);
        this.createDrop = this.createDrop.bind(this);
        this.onClick = this.onClick.bind(this);
    }
    onClick () {
        if (typeof this.props.onClick == 'function') this.props.onClick();
        this.setState({
            toggleState: !this.state.toggleState
        });
    }
    updateDrop (e, index) {
        var drop = this.state.drops[index];

        drop.done = false;
        drop.size = e.size;
        drop.top = e.top;
        drop.left = e.left;

        this.forceUpdate();
        setTimeout(() => {
            drop.done = true;
            this.forceUpdate();
        }, 1000);
    }
    createDrop (callback) {
        var drops = this.state.drops.concat([]);
        drops.push({
            size: 0,
            top: 0,
            left: 0,
            done: true
        });
        this.setState({
            drops: drops
        }, () => callback(this.state.drops.length - 1));
    }
    findFreeDrop (callback) {
        var i = 0;
        if (!this.state.drops.length) {
            return this.createDrop(callback);
        }

        for (i = 0; i < this.state.drops.length; i++) {
            if (this.state.drops[i].done == true) {
                return callback(i);
            }
        }
        this.createDrop(callback);
    }
    onMouseDown (event) {
        event.stopPropagation();
        var page = {
            x: event.pageX,
            y: event.pageY
        };
        if (this.state.drop) {
            var maxWidthHeight = Math.max(this.refs.button.offsetWidth, this.refs.button.offsetWidth);

            this.findFreeDrop((i) => {
                var rect = this.refs.button.getBoundingClientRect();
                var x = page.x - window.scrollX - maxWidthHeight / 2 - rect.left;
                var y = page.y - window.scrollY - maxWidthHeight / 2 - rect.top;

                this.updateDrop({
                    size: maxWidthHeight,
                    top: y,
                    left: x
                }, i);
            });
        }
    }
    render () {
        var toggleClass = this.state.toggleState ? this.props.toggleOffClass : this.props.toggleOnClass;
        var classes = classNames(this.props.classes, 'materialBtn', this.props.buttonStyle, toggleClass);
        return (
            <div className={classes} onMouseDown={this.onMouseDown} onClick={this.onClick} ref="button">
                {this.state.drops.map((e, index) => {
                    var classes = classNames({
                        drop: true,
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
MaterialButton.propTypes = {
    buttonStyle: React.PropTypes.string,
    classes: React.PropTypes.string,
    children: React.PropTypes.node,
    toggleOffClass: React.PropTypes.string,
    toggleOnClass: React.PropTypes.string,
    onClick: React.PropTypes.func
};

export default MaterialButton;