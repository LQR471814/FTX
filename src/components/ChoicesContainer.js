import React from "react";
import PropTypes from "prop-types";
import "../css/MiniComponents.css";
import "../css/ChoiceOverlay.css";
import Choice from "./Choice";

class ChoicesContainer extends React.Component {
  constructor(props) {
    super(props);

    this.choiceDivRef = React.createRef();
    this.overlayDivRef = React.createRef();

    this.currentKey = 0;

    this.closeChoice = this.closeChoice.bind(this);
    this.uniqueKey = this.uniqueKey.bind(this);
  }

  uniqueKey(prefix) {
    this.currentKey++;
    return prefix + this.currentKey.toString();
  }

  async componentDidUpdate() {
    if (this.props.show === true) {
      document.getElementById("AppGrid").style.transition = "none";
      document.getElementById("AppGrid").style.filter = "blur(4px)";

      this.choiceDivRef.current.style.opacity = "50%";
      this.choiceDivRef.current.style.width = "50%";

      this.choiceDivRef.current.style.display = "grid";
      this.overlayDivRef.current.style.display = "block";

      await new Promise((r) => setTimeout(r, 10));

      this.choiceDivRef.current.style.opacity = "100%";
      this.choiceDivRef.current.style.width = "75%";
      this.applyDefault = false;
    }
  }

  async closeChoice(identifier) {
    document.getElementById("AppGrid").style.transition = "all 0.25s";
    document.getElementById("AppGrid").style.filter = "none";

    this.choiceDivRef.current.style.width = "100%";
    this.choiceDivRef.current.style.opacity = "50%";

    await new Promise((r) =>
      setTimeout(
        r,
        parseFloat(
          window.getComputedStyle(this.choiceDivRef.current)[
            "transitionDuration"
          ],
          10
        ) * 1000
      )
    );

    this.choiceDivRef.current.style.display = "none";
    this.overlayDivRef.current.style.display = "none";

    this.props.chosenCallback(identifier);
  }

  render() {
    return (
      <div
        ref={this.overlayDivRef}
        style={{
          height: "100vh",
          width: "100vw",
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "none",
          justifyContent: "center",
        }}
      >
        <p className="Info">{this.props.mainLabel}</p>
        <div
          className="ChoiceContainer"
          ref={this.choiceDivRef}
          style={{
            gridTemplateColumns:
              "repeat(" + this.props.columns.toString() + ", 1fr)",
            display: "none",
          }}
        >
          {this.props.items.map((arrayItem) => {
            var itemLabels = this.props.labelLogic(arrayItem);
            return (
              <Choice
                key={this.uniqueKey(this.props.componentId + "_Choice_")}
                label={itemLabels.label}
                icon={itemLabels.icon}
                closeCallback={this.closeChoice}
                identifier={itemLabels.identifier}
              />
            );
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
  show: PropTypes.bool.isRequired,
  componentID: PropTypes.string.isRequired, //? Used to discern keys of child "Choice" components in different "ChoiceContainer"s
};

export default ChoicesContainer;
