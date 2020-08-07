import React, { Component } from "react";
import { Link } from "react-router-dom";
class ChatroomLink extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.props.onClick(this.props.id);
  }
  render() {
    return (
      <button
        onClick={this.handleClick}
        className="btn text-left text-info csnav-btn mb-2"
      >
        <Link to="/chat">
          <h5>{this.props.name}</h5>
        </Link>
      </button>
    );
  }
}

export default ChatroomLink;
