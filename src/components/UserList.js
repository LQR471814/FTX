import React from 'react';
import '../css/Window.css';
import '../css/MiniComponents.css';
import User from './User';
import uniqid from 'uniqid';

class UserList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {"users":[
            {
                name: "test",
                ip: "127.0.0.1"
            },
            {
                name: "test1",
                ip: "127.0.0.1"
            },
            {
                name: "test2",
                ip: "127.0.0.1"
            },
            {
                name: "test3",
                ip: "127.0.0.1"
            },
            {
                name: "test5",
                ip: "127.0.0.1"
            },
            {
                name: "test6",
                ip: "127.0.0.1"
            },
            {
                name: "test7",
                ip: "127.0.0.1"
            },
            {
                name: "test8",
                ip: "127.0.0.1"
            }
        ]}
    }
    
    render() {
        return (
            <div className="Window" style={{height: "50%"}}>
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

export default UserList;