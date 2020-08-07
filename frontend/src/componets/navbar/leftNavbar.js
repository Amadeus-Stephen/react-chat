import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DirectLink from "./links/directLink";
import ChatroomLink from "./links/chatroomLink";

import CreateChatDialog from "./dialog/createChatDialog";
class LeftNavbar extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;

    this.state = {
      chatrooms: [],
      chatroom: null,
      directData: [],
      directto: null,
      isDialog: false,
    };
    this.source = axios.CancelToken.source();
    this.updateLocalState = this.updateLocalState.bind(this);
    this.createChat = this.createChat.bind(this);
    this.getChatrooms = this.getChatrooms.bind(this);
    this.getDirect = this.getDirect.bind(this);
    this.clickChatLink = this.clickChatLink.bind(this);
  }
  componentDidMount() {
    this._isMounted = true;
    this.props.socket.on("create_direct", () => {
      this.getDirect();
    });
    this.props.socket.on("get_chats", (data) => {
      this.setState({ chatrooms: data });
    });
    this.props.socket.on("get_direct", (data) => {
      this.setState({ directData: data });
    });

    this.getChatrooms();
    this.getDirect();
  }
  componentWillUnmount() {
    this._isMounted = false;
    this.source.cancel();
  }
  updateLocalState(stateObject) {
    this.setState(stateObject);
  }
  createChat(name) {
    this.props.createChat(name);
  }
  getChatrooms() {
    this.props.socket.emit("get_chats");
  }
  getDirect() {
    this.props.socket.emit("get_direct");
  }
  clickChatLink(id) {
    this.props.updateAppState({ id });
  }
  renderChatLinks() {
    return this.state.chatrooms.map((i, index) => {
      return (
        <ChatroomLink
          name={i.name}
          id={i._id}
          key={index}
          onClick={this.clickChatLink}
        />
      );
    });
  }
  renderDirectLinks() {
    return this.state.directData.map((i, index) => {
      return (
        <DirectLink direct={i} tag={i.users} key={index} chatype={"direct"} />
      );
    });
  }
  render() {
    return (
      <nav>
        <div className="csnav leftnav bg-dark">
          <div className="col">
            <h2 className="mb-0">
              <button className="btn text-left  csnav-btn " type="button">
                <Link to="/">
                  <h5 className="text-info">
                    Home
                    <svg
                      width="1em"
                      height="1em"
                      viewBox="0 0 16 16"
                      className="bi bi-house ml-1"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"
                      />
                      <path
                        fillRule="evenodd"
                        d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"
                      />
                    </svg>
                  </h5>
                </Link>
              </button>
            </h2>
            <div className="d-block">
              <div className="bg-dark card mb-2">
                <h2 className="mb-0">
                  <button
                    onClick={() => {
                      this.setState({
                        isDialog: true,
                      });
                    }}
                    className="btn text-left  csnav-btn "
                    type="button"
                  >
                    <Link to="#">
                      <h5 className="text-info">
                        New Chat
                        <svg
                          width="1em"
                          height="1em"
                          viewBox="0 0 16 16"
                          className="bi bi-chat-left-quote ml-1"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14 1H2a1 1 0 0 0-1 1v11.586l2-2A2 2 0 0 1 4.414 11H14a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
                          />
                          <path
                            fillRule="evenodd"
                            d="M7.066 4.76A1.665 1.665 0 0 0 4 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z"
                          />
                        </svg>
                      </h5>
                    </Link>
                  </button>
                </h2>
              </div>
            </div>
            <h4>
              Chats
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                className="bi bi-chat-left ml-1"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M14 1H2a1 1 0 0 0-1 1v11.586l2-2A2 2 0 0 1 4.414 11H14a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
                />
              </svg>
            </h4>
            <div className="csnavBox">{this.renderChatLinks()}</div>
          </div>
        </div>
        <CreateChatDialog
          updateParentState={this.updateLocalState}
          isDialog={this.state.isDialog}
          createChat={this.createChat}
        >
          Pick a name for your new chat
        </CreateChatDialog>
      </nav>
    );
  }
}

export default LeftNavbar;
