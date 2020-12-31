import React from "react";
import "../css/Banner.css";
import { ReactComponent as CloseIcon } from "../css/assets/close.svg";
import PropTypes from "prop-types";

class Banner extends React.Component {
  constructor(props) {
    super(props);

    this.onClickClose = this.onClickClose.bind(this);
    this.onClickSetup = this.onClickSetup.bind(this);
  }

  onClickClose(e) {
    this.props.closedCallback();
  }

  onClickSetup(e) {
    this.props.callback();
  }

  render() {
    if (this.props.show === true) {
      return (
        <div
          className="BannerContainer"
          style={{ backgroundColor: this.props.backgroundColor }}
        >
          <div style={{ flex: "1", justifyContent: "center" }}>
            <span style={{ color: this.props.textColor }}>
              {this.props.text}
            </span>
            <button className="SetupButton" onClick={this.onClickSetup}>
              {this.props.buttonText}
            </button>
          </div>
          <button onClick={this.onClickClose} className="CloseButton">
            <CloseIcon />
          </button>
        </div>
      );
    } else {
      return <div style={{gridColumn: "1 / -1"}}></div>
    }
  }
}

Banner.propTypes = {
  show: PropTypes.bool.isRequired,
  callback: PropTypes.func.isRequired,
  closedCallback: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
};

export default Banner;
