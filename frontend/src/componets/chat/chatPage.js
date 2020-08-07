import React, { Component } from "react";
import ChatLogs from "./chatLogs";
import { Redirect } from "react-router-dom";
class ChatPage extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      msg: "",
      chat: [],
      redirectTo: null,
      id: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this._isMounted = true;
    this.setState({ id: this.props.id });
    this.props.socket.emit("connect_to", { socket: this.props.id });
    this.props.socket.on("connect_to", (data) => {
      if (data.error) {
        this.props.addFlash({ success: false, msg: data.error.msg });
        if (this._isMounted) {
          this.setState({ redirectTo: "/" });
        }
      } else {
        if (this._isMounted) {
          this.setState({ chat: data });
        }
      }
    });
    this.props.socket.on("message", (data) => {
      if (this._isMounted) {
        this.setState({
          chat: [...this.state.chat, { user: data.user, msg: data.msg }],
        });
        if (this.props.username === data.user) {
          this.chatbox.scrollTo(0, this.chatbox.scrollHeight);
        }
      }
    });
  }
  componentDidUpdate() {
    if (this.props.id !== this.state.id) {
      this.props.socket.emit("connect_to", { socket: this.props.id });
      this.setState({ id: this.props.id });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  onTextChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit(event) {
    event.preventDefault();
    this.props.socket.emit("message", {
      user: { username: this.props.username, id: this.props.userid },
      msg: this.state.msg,
    });
    if (this._isMounted) {
      this.setState({ msg: "" });
    }
  }

  renderChat() {
    const { chat } = this.state;
    return chat.map(({ user, msg }, idx) => {
      if (user.id === this.props.userid) {
        return <ChatLogs ifMe={true} msg={msg} user={user} key={idx} />;
      } else {
        return <ChatLogs ifMe={false} msg={msg} user={user} key={idx} />;
      }
    });
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={{ pathname: this.state.redirectTo }} />;
    } else {
      return (
        <div className="container chatpage">
          <div
            className=" card
           cscard chat"
          >
            <div className="chatbox ss3" ref={(c) => (this.chatbox = c)}>
              {this.renderChat()}
            </div>
            <form
              onSubmit={this.handleSubmit}
              className="input-group mb-3 card-body"
            >
              <div className="input-group-prepend">
                <button className="btn text-left  csnav-btn " type="submit">
                  Send
                </button>
              </div>
              <input
                className="form-control"
                onChange={(e) => this.onTextChange(e)}
                value={this.state.msg}
                name="msg"
                placeholder=""
                type="text"
              />
            </form>
          </div>
        </div>
      );
    }
  }
}

export default ChatPage;
