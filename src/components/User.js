import React from 'react';
import '../css/MiniComponents.css';
import PropTypes from 'prop-types';

class User extends React.Component {
    constructor(props) {
        super(props)

        this.onClick = this.onClick.bind(this)
    }

    onClick() {
        this.props.commChoice.current.show({name: this.props.name, ip: this.props.ip})
    }

    render() {
        return (
            <div className="User" onClick={this.onClick}>
                <p className="UserName">{this.props.name}</p>
                <p className="Ip">{this.props.ip}</p>
            </div>
        );
    }
}

User.propTypes = {
    commChoice: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    ip: PropTypes.string.isRequired
}

export default User;