import React from 'react';
import PropTypes from 'prop-types';
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
    shadow: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default Card;