import React from 'react';
import '../css/Window.css';

class PendingTransfers extends React.Component {
    render() {
        return (
            <div className="Window" style={{height: "25%"}}>
                <p className="Title">Pending Transfers</p>
            </div>
        );
    }
}

export default PendingTransfers;