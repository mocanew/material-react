import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';

import './index.scss';

class Card extends React.Component {
    constructor(props) {
        super(props);
        var defaults = {
            shadow: true
        };
        this.state = _.merge({}, defaults, _.pick(props, Object.keys(defaults)));
    }
    render() {
        var classes = classnames({
            materialCard: true,
            shadow: this.state.shadow
        });
        return (
            <div className= {classes}>
                <div className="wrapper">
                    {this.props.children}
                </div>
            </div >
        );
    }
}
Card.propTypes = {
    shadow: React.PropTypes.bool,
    children: React.PropTypes.oneOfType([
        React.PropTypes.arrayOf(React.PropTypes.node),
        React.PropTypes.node
    ])
};

export default Card;