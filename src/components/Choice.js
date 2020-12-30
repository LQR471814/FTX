import React from "react";
import PropTypes from "prop-types";
import "../css/MiniComponents.css";
import "../css/ChoiceOverlay.css";
import "../css/Choice.css";

class Choice extends React.Component {
  constructor(props) {
    super(props);

    this.iconRef = React.createRef();
    this.tagRef = React.createRef();

    this.textFactor = 0.015;
    this.iconFactor = 0.1;

    this.updateChoiceSizes = this.updateChoiceSizes.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateChoiceSizes);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateChoiceSizes);
  }

  render() {
    return (
      <div
        className="ChoiceDiv"
        onClick={(event) => {
          event.persist();
          if (this.props.identifier === undefined) {
            this.props.closeCallback(this.props.label);
          } else {
            this.props.closeCallback(this.props.identifier);
          }
        }}
      >
        <this.props.icon
          ref={this.iconRef}
          style={{
            width: Math.round(
              Math.min(window.innerWidth, window.innerHeight) * this.iconFactor
            ),
            height: Math.round(
              Math.min(window.innerWidth, window.innerHeight) * this.iconFactor
            ),
          }}
        />
        <p
          className="Tag"
          ref={this.tagRef}
          style={{
            fontSize: Math.round(
              Math.min(window.innerWidth, window.innerHeight) * this.textFactor
            ),
          }}
        >
          {this.props.label}
        </p>
      </div>
    );
  }

  updateChoiceSizes() {
    var calc = Math.round(
      Math.min(window.innerWidth, window.innerHeight) * this.iconFactor
    );

    this.iconRef.current.style.width = calc;
    this.iconRef.current.style.height = calc;

    this.tagRef.current.style.fontSize = Math.round(
      Math.min(window.innerWidth, window.innerHeight) * this.textFactor
    );
  }
}

Choice.propTypes = {
  icon: PropTypes.object.isRequired,
  label: PropTypes.any.isRequired,
  closeCallback: PropTypes.func.isRequired,
  identifier: PropTypes.any, //? An extra piece of data that will be passed in closeCallback as an identifier (if undefined it will default to the label)
};

export default Choice;
