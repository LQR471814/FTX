import React from 'react';
import PropTypes from 'prop-types';
import '../css/MiniComponents.css';
import '../css/ChoiceOverlay.css';
import '../css/Choice.css';

class Choice extends React.Component {
    render() {
        return (
            <div className="ChoiceDiv" onClick={ (event) => {
                event.persist()
                if (this.props.identifier === undefined) {
                    this.props.closeCallback(this.props.label)
                } else {
                    this.props.closeCallback(this.props.identifier)
                }
                }}>

                <this.props.icon />
                <p className="Tag">{this.props.label}</p>
            </div>
        );
    }
}

Choice.propTypes = {
    icon: PropTypes.object.isRequired,
    label: PropTypes.any.isRequired,
    closeCallback: PropTypes.func.isRequired,
    identifier: PropTypes.any //? An extra piece of data that will be passed in closeCallback as an identifier (if undefined it will default to the label)
}

export default Choice;