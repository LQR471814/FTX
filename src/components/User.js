import React from 'react';
import '../css/MiniComponents.css';
import PropTypes from 'prop-types';

class User extends React.Component {
    render() {
        return (
            <div className="User">
                <p className="UserName">{this.props.name}</p>
                <p className="Ip">{this.props.ip}</p>
            </div>
        );
    }
}

User.propTypes = {
    name: PropTypes.string.isRequired,
    ip: PropTypes.string.isRequired
}

export default User;