import React, { Component } from "react";

class ThrowFlash extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = { active: true };
  }
  handleClick() {
    this.props.removeFlash(this.props.index);
  }
  render() {
    return (
      <div
        className={`alert position-absolute fixed-bottom ${
          this.props.success ? "alert-success" : "alert-warning"
        } alert-dismissible fade show mb-0  ${
          this.state.active ? "" : "false"
        }`}
      >
        <strong>
          {this.props.msg}/ message||{this.props.length}
        </strong>
        <button type="button" className="close" onClick={this.handleClick}>
          <span>&times;</span>
        </button>
      </div>
    );
  }
}

export default ThrowFlash;
