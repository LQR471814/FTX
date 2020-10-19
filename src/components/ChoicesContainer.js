import React from 'react';
import PropTypes from 'prop-types';
import '../css/MiniComponents.css';
import '../css/ChoiceOverlay.css';
import Choice from './Choice';
import uniqid from 'uniqid';

class ChoicesContainer extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            choiceDivID: uniqid(),
            overlayDivID: uniqid(),
        }

        this.closeChoice = this.closeChoice.bind(this)
    }

    async componentDidUpdate() {
        if (this.props.show === true) {
            document.getElementById("AppGrid").style.transition = "none"
            document.getElementById("AppGrid").style.filter = "blur(4px)"

            document.getElementById(this.state.choiceDivID).style.opacity = "50%"
            document.getElementById(this.state.choiceDivID).style.columnGap = "0px"

            document.getElementById(this.state.choiceDivID).style.display = "grid"
            document.getElementById(this.state.overlayDivID).style.display = "block"
            await new Promise(r => setTimeout(r, 50));
            document.getElementById(this.state.choiceDivID).style.opacity = "100%"
            document.getElementById(this.state.choiceDivID).style.columnGap = "100px"
            this.applyDefault = false
        }
    }

    async closeChoice(identifier) {
        document.getElementById("AppGrid").style.transition = "all 0.25s"
        document.getElementById("AppGrid").style.filter = "none"

        document.getElementById(this.state.choiceDivID).style.columnGap = "150px"
        document.getElementById(this.state.choiceDivID).style.opacity = "50%"

        await new Promise(r => setTimeout(r, parseFloat(window.getComputedStyle(document.getElementById(this.state.choiceDivID))["transitionDuration"], 10) * 1000))

        document.getElementById(this.state.choiceDivID).style.display = "none"
        document.getElementById(this.state.overlayDivID).style.display = "none"

        this.props.chosenCallback(identifier)
    }

    render() {
        return (
            <div id={this.state.overlayDivID} style={{height: '100vh', width: '100vw', position: "fixed", left: "50%", top: "50%", transform: "translate(-50%, -50%)", display: "none"}}>
                <div className="ChoiceContainer" id={this.state.choiceDivID} style={{gridTemplateColumns: "repeat(" + this.props.columns.toString() + ", 1fr)", display: "none"}}>
                    <span className="Info">{this.props.mainLabel}</span>
                    {this.props.items.map((arrayItem)=>{
                        var itemLabels = this.props.labelLogic(arrayItem)
                        return <Choice key={uniqid()} label={itemLabels.label} icon={itemLabels.icon} closeCallback={this.closeChoice} identifier={itemLabels.identifier} />
                    })}
                </div>
            </div>
        );
    }
}

ChoicesContainer.propTypes = {
    labelLogic: PropTypes.func.isRequired, //? A function that decides what icon and label each item in items should get (Must take in a parameter with the value of an element in items prop and return an object with keys icon and label. optional. return identifier)
    mainLabel: PropTypes.string.isRequired, //? The main label that will be shown
    icons: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    chosenCallback: PropTypes.func.isRequired, //? This callback function should make sure that whatever gets passed to shown is false after being called
    columns: PropTypes.number.isRequired,
    show: PropTypes.bool.isRequired
}

export default ChoicesContainer;