import React, { Component } from "react";
import io from "socket.io-client";
import axios from "axios";
import { Route } from "react-router-dom";
import HomePage from "./componets/homePage";

import LeftNavbar from "./componets/navbar/leftNavbar";
import TopNavbar from "./componets/navbar/topNavbar";

import ChatPage from "./componets/chat/chatPage";

import SignupPage from "./componets/user/signupPage";
import LoginPage from "./componets/user/loginPage";

import ThrowFlash from "./componets/util/throwFlash";

class App extends Component {
  _isMounted = false;
  constructor() {
    super();

    this.proxy = "http://localhost:5000";
    this.socket = io.connect(this.proxy);
    this.state = {
      loggedIn: false,
      username: null,
      userid: null,
      chatroom: null,
      id: null,
      flashes: [],
      redirectTo: null,
    };
    this.updateAppState = this.updateAppState.bind(this);
    this.createChat = this.createChat.bind(this);
    this.getUser = this.getUser.bind(this);
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.addFlash = this.addFlash.bind(this);
    this.removeFlash = this.removeFlash.bind(this);
    this.setRedirect = this.setRedirect.bind(this);
  }
  componentDidMount() {
    this._isMounted = true;
    console.log(process.env);
    this.setState({ redirectTo: null });
    this.socket.on("init", (data) => {
      this.addFlash({ success: true, msg: data });
    });
    this.getUser();
    this.socket.on("user_not_signed_in", () => {
      this.addFlash({
        success: false,
        msg: "You need to signin to use that feature",
      });
    });
  }
  componentDidUpdate() {
    this._isMounted = false;
  }
  updateAppState(stateObject) {
    this.setState(stateObject);
  }
  createChat(name) {
    axios
      .post(`${this.proxy}/chatroom/`, {
        name,
        owner: this.state.userid,
      })
      .then((response) => {
        if (response.status === 200) {
          if (response.data.error) {
            let msg = response.data.error.msg;
            this.addFlash({ success: false, msg });
          } else {
            if (response.data.success) {
              let msg = response.data.success.msg;
              this.addFlash({ success: true, msg });
              this.socket.emit("get_chats");
            }
          }
        }
      });
  }
  getUser() {
    axios.get(`${this.proxy}/user/`).then((response) => {
      if (response.data.user) {
        this.setState({
          loggedIn: true,
          username: response.data.user.username,
          userid: response.data.user._id,
        });
      } else {
        this.setState({
          loggedIn: false,
          username: null,
        });
      }
    });
  }
  logout() {
    axios
      .post(`${this.proxy}/user/logout`)
      .then((response) => {
        //sends a post request to log user out of current session
        if (response.status === 200) {
          this.addFlash({ success: true, msg: "Successfully logged out" });
          this.setState({
            loggedIn: false,
            username: null,
          });
        }
      })
      .catch((error) => {
        console.log("Logout error", error);
      });
  }
  login(username, password) {
    axios
      .post(`${this.proxy}/user/login`, { username, password })
      .then((response) => {
        if (response.status === 200) {
          if (response.data.error) {
            let msg = response.data.error.msg;
            this.addFlash({ success: false, msg });
          } else {
            this.setState({
              loggedIn: true,
              username: response.data.username,
            });
            this.addFlash({ success: true, msg: "Logged in successfully " });
            this.setRedirect("/");
          }
        }
      })
      .catch((error) => {
        console.log(error);
        this.addFlash({
          success: false,
          msg: "An unexpected error has occurred. Please try again later",
        });
      });
  }
  signup(username, email, password, confirmPassword) {
    axios
      .post(`${this.proxy}/user/`, {
        username,
        email,
        password,
        confirmPassword,
      })
      .then((response) => {
        if (response.data.error) {
          let msg = response.data.error.msg;
          this.addFlash({ success: false, msg });
        } else {
          console.log(response.data);
          this.addFlash({ success: true, msg: "Successfully created account" });
          this.setRedirect("/login");
        }
      })
      .catch((error) => {
        console.log(error);
        this.addFlash({
          success: false,
          msg: "An unexpected error has occurred. Please try again later",
        });
      });
  }
  addFlash(flash) {
    let flashes = this.state.flashes;
    flashes.push(flash);
    this.setState({ flashes });
  }
  removeFlash(index) {
    let flashes = this.state.flashes;
    flashes.splice(index, 1);
    this.setState({ flashes });
  }

  setRedirect(redirectTo) {
    this.setState({ redirectTo });
  }
  renderFlash() {
    return this.state.flashes.map(({ msg, success }, index) => {
      return (
        <ThrowFlash
          removeFlash={this.removeFlash}
          msg={msg}
          success={success}
          index={index}
          key={index}
          length={this.state.flashes.length}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <TopNavbar logout={this.logout} loggedIn={this.state.loggedIn} />
        <LeftNavbar
          updateAppState={this.updateAppState}
          createChat={this.createChat}
          socket={this.socket}
        />
        <div className="mt-5 ">
          {this.renderFlash()}
          <Route
            path="/"
            exact
            render={() => (
              <HomePage
                user={this.state.username}
                loggedIn={this.state.loggedIn}
              />
            )}
          />
          <Route
            path="/chat/"
            render={() => (
              <ChatPage
                updateAppState={this.updateAppState}
                addFlash={this.addFlash}
                id={this.state.id}
                socket={this.socket}
                username={this.state.username}
                userid={this.state.userid}
              />
            )}
          />
          <Route
            path="/login"
            render={() => (
              <LoginPage
                login={this.login}
                loggedIn={this.state.loggedIn}
                redirectTo={this.state.redirectTo}
                setRedirect={this.setRedirect}
              />
            )}
          />
          <Route
            path="/signup"
            render={() => (
              <SignupPage
                signup={this.signup}
                redirectTo={this.state.redirectTo}
                setRedirect={this.setRedirect}
              />
            )}
          />
        </div>
      </div>
    );
  }
}

export default App;
