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
    this.closeButtonRef = React.createRef();

    this.currentKey = 0;
    this.cancelButtonFactor = 0.03;

    this.closeChoice = this.closeChoice.bind(this);
    this.uniqueKey = this.uniqueKey.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onCloseClicked = this.onCloseClicked.bind(this);
  }

  uniqueKey(prefix) {
    this.currentKey++;
    return prefix + this.currentKey.toString();
  }

  onKeyDown(e) {
    if (e.code === "Escape") {
      var evObj = document.createEvent("Events");
      evObj.initEvent("click", true, false);

      this.closeButtonRef.current.dispatchEvent(evObj);
    }
  }

  onCloseClicked() {
    this.closeButtonRef.current.className += " Active";
    this.closeChoice(undefined);
  }

  async componentDidUpdate() {
    if (this.props.show === true) {
      document.addEventListener("keydown", this.onKeyDown);

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

    document.removeEventListener("keydown", this.onKeyDown);

    this.props.chosenCallback(identifier);
  }

  render() {
    return (
      <div className="OverlayDiv" ref={this.overlayDivRef}>
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
        <div
          className="CancelButton"
          ref={this.closeButtonRef}
          style={{
            width: Math.round(
              Math.min(window.innerWidth, window.innerHeight) *
                this.cancelButtonFactor
            ),
            height: Math.round(
              Math.min(window.innerWidth, window.innerHeight) *
                this.cancelButtonFactor
            ),
            padding: Math.round(
              Math.min(window.innerWidth, window.innerHeight) * 0.0125
            ),
          }}
          onClick={this.onCloseClicked}
          onTransitionEnd={(e) => {
            if (e.target.className === "CancelButton Active") {
              e.target.className = "CancelButton";
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-0.1988677978515625 -0.006744384765625 128.79347229003906 128.74560546875"
          >
            <path
              className="cls-1"
              d="M311.07,420.94l48.09-48.08a9.53,9.53,0,0,0,0-13.43h0a9.52,9.52,0,0,0-13.44,0l-48.08,48.08-48.09-48.08a9.51,9.51,0,0,0-13.43,0h0a9.51,9.51,0,0,0,0,13.43l48.08,48.08L236.12,469a9.5,9.5,0,1,0,13.43,13.43l48.09-48.08,48.08,48.08A9.5,9.5,0,1,0,359.16,469Z"
              transform="translate(-233.35 -356.66)"
            ></path>
          </svg>
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
