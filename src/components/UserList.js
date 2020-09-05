import React from 'react';
import '../css/Window.css';
import '../css/MiniComponents.css';
import User from './User';
import uniqid from 'uniqid';
import _ from 'lodash';
import PropTypes from 'prop-types';

class UserList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {users:[]}
    }

    addUser(user) {
        var newUsers = _.cloneDeep(this.state.users)
        newUsers.push(user)
        this.setState({users:newUsers})
    }

    removeUser(user) {
        var newUsers = _.cloneDeep(this.state.users)
        newUsers.splice(newUsers.indexOf(user), 1)
        this.setState({users:newUsers})
    }
    
    render() {
        return (
            <div className="Window" style={{height: "40%"}}>
                <p className="Title">User List</p>
                <div className="ComponentContainer">
                    {this.state.users.map((user)=>{
                        return <User key={uniqid()} name={user.name} ip={user.ip} />
                    })}
                </div>
            </div>
        );
    }
}

UserList.propTypes = {
    commSocket: PropTypes.object.isRequired
}

export default UserList;