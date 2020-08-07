import React, { Component } from "react";

class CreateChatDialog extends Component {
  constructor(props) {
    super(props);
    this.state = { isDialog: false, name: "" };
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.overLayRef = React.createRef();
  }
  componentDidUpdate() {
    const overlay = this.overLayRef.current;
    if (this.props.isDialog !== this.state.isDialog) {
      let isDialog = this.props.isDialog;
      this.setState({ isDialog });
      overlay.classList.toggle("show");
    }
  }
  handleSubmit(event) {
    event.preventDefault();
    this.handleCancel();
    this.props.createChat(this.state.name);
  }
  handleCancel() {
    let isDialog = this.props.isDialog;
    isDialog = !isDialog;
    this.props.updateParentState({ isDialog });
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  render() {
    return (
      <div>
        {this.props.isDialog ? (
          <div className="dialog bg-dark col-md-6 ">
            <button onClick={this.handleCancel} className="dialogBtn bg-dark">
              &times;
            </button>
            <div>
              <div className="dialogText">{this.props.children}</div>
              <form
                onSubmit={(event) => this.handleSubmit(event)}
                className="form-group "
              >
                <input
                  type="text"
                  name="name"
                  onChange={(e) => this.handleChange(e)}
                  value={this.state.name}
                  className="form-control"
                  placeholder="Enter Name"
                />
                <div className="dialogOptions">
                  <button
                    type="button"
                    onClick={this.handleCancel}
                    className="form-control btn btn-danger"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="form-control btn btn-success"
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          ""
        )}
        <div
          onClick={this.handleCancel}
          ref={this.overLayRef}
          className="overlay"
        ></div>
      </div>
    );
  }
}

export default CreateChatDialog;
