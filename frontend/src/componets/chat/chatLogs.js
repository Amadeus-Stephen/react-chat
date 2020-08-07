import React, { Component } from "react";
class ChatLogs extends Component {
  render() {
    return (
      <div className={`${this.props.ifMe ? "text-left" : "text-right"} m-2`}>
        <span className="badge badge-dark">
          <h6 className="m-0 text-info">{this.props.msg}</h6>
        </span>
      </div>
    );
  }
}

export default ChatLogs;
