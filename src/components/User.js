import React from 'react';
import '../css/MiniComponents.css';
import PropTypes from 'prop-types';

class User extends React.Component {
    constructor(props) {
        super(props)

        this.onClick = this.onClick.bind(this)
    }

    onClick() {
        this.props.setCurrentTargetUser(this.props.name)
        this.props.displayCommChoice(true)
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
    displayCommChoice: PropTypes.func.isRequired,
    setCurrentTargetUser: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    ip: PropTypes.string.isRequired
}

export default User;