import ReactDOM from "react-dom";
import React from "react"
import axios from "axios"
import io from 'socket.io-client'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css"
const server = 'http://localhost:5050'
const socket = io.connect(server)
let current_user;
if (JSON.parse(window.sessionStorage.getItem('user'))){
  current_user = JSON.parse(window.sessionStorage.getItem('user'))[0];
}
else {
  current_user ={username: ""}
}
class App extends React.Component {
  render() {
    return (
      <Router>
        <Route path="/" exact component={StartPage} />
        <Route path="/home" exact component={HomePage} />
        <Route path="/chat/:chatype/:chatroom/" exact component={ChatPage} />
        <Route path="/account/signin" exact component={SignInPage} />
        <Route path="/account/signup" exact component={SignUpPage} />
      </Router>
    );
  }
}

class HomePage extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
  }
  componentDidMount() {
    this._isMounted = true
  }
  componentWillUnmount() {
    this._isMounted = false
  }
  render() {
    return (
    <div>
      <Navbar chatype={null}/>
      <div className="backgoundpage chatpage"></div>
    </div>);
  }
}

class ChatPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { msg: "", chat: [], user: current_user.username , prevchatroom:this.props.match.params.chatroom};
    this._isMounted = false
  }
  componentDidMount() {
    this._isMounted = true
    socket.emit("connect_to" , {socket:this.props.match.params.chatroom , type:this.props.match.params.chatype})
    socket.on("connect_to" , (data) => {
      this.setState({chat:data})
    })
    socket.on("chat_message", (data) => {
      this.setState({
        chat: [...this.state.chat, { user:data.user, msg:data.msg }]
      });
      if (this.state.user === data.user) {
        this.chatbox.scrollTo(0, this.chatbox.scrollHeight)
      }
    });
  }
  componentDidUpdate() {
    if (this.state.prevchatroom !== this.props.match.params.chatroom) {
      this.setState({prevchatroom:this.props.match.params.chatroom})
      socket.emit("connect_to" , {socket:this.props.match.params.chatroom , type:this.props.match.params.chatype})
    }
  }
  componentWillUnmount() {
    this._isMounted = false
  }
  onTextChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onMessageSubmit = (e) => {
    e.preventDefault();
    socket.emit("chat_message", { user:this.state.user, msg:this.state.msg, type:this.props.match.params.chatype });
    this.setState({ msg: "" });
  };

  renderChat() {
    const { chat } = this.state;
    return chat.map(({ user, msg }, idx) => {
      if (user === current_user.username ) {
       return( <ChatLogs tf={true} key={idx} msg={msg} user={user}/> )
      }
      else {
        return( <ChatLogs tf={false} key={idx} msg={msg} user={user}/> )
      }
    });
  }

  render() {
    return (
      <div >
        <Navbar  />
        <div className="chatbackground chatpage">
        <div className="render-chat">
          <div className="chatbox" ref={(c) => this.chatbox = c}>
            {this.renderChat()}
          </div>
        </div>
        <form onSubmit={this.onMessageSubmit} className=" input-group messageform ">
          <div className="input-group-prepend">
            <button type="button" className="btn text-left text-info  input-group-prepend" onClick={this.onMessageSubmit}>Send</button>
          </div>
          <input  name="msg"  className="form-control "onChange={e => this.onTextChange(e)} value={this.state.msg} placeholder="message"/>
        </form>
        </div>
      </div>
    );
  }
}
/*
<Navbar username={this.props.match.params.user} />
*/
class ChatLogs extends React.Component {
  render() {
    return (
      <div className={`${this.props.tf? "text-right" : "text-left"} m-2`}><span className="badge badge-dark"><h6 className="m-0 text-info">{this.props.msg}</h6></span></div>
    );
  }
}
class Navbar extends React.Component {
  
  constructor(props) {
    super(props)
    this.displaychatroomitems = this.displaychatroomitems.bind(this)
    this.displaydirectitems = this.displaydirectitems.bind(this)
    this.createChat = this.createChat.bind(this)
    this._isMounted = false;
    this.createDirect = this.createDirect.bind(this)
    this.state = {chatrooms:[] , chatroom: null, owner:null, username:null,directData: [] ,directto:null}
    this.source = axios.CancelToken.source();
    this.getChatrooms = this.getChatrooms.bind(this)
    this.getDirect = this.getDirect.bind(this)
  }
  componentDidMount() {
    this._isMounted = true
    socket.on('init',(data) =>{
    });
    socket.on("create_chat", () => {
      this.getChatrooms()
    })
    socket.on("create_direct", () => {
      this.getDirect()
    })
    socket.on("get_chat" , (data) => {
      this.setState({chatrooms:data})
    })
    socket.on("get_direct", (data) => {
      this.setState({directData:data})
    })
    

    this.getChatrooms()
    this.getDirect()
  }
  componentWillUnmount() {
    this._isMounted = false
    this.source.cancel();
  }

  getChatrooms() {
    socket.emit("get_chat" )
  }
  getDirect() {
    socket.emit("get_direct", current_user.username)
  }
  createChat() {
    const prom = new Promise(async (reslove) => {
      let chatname = prompt("Enter desired chatname")

      reslove(await chatname)
    })
    prom.then((data) => {
      socket.emit("create_chat", {chatroom:data , owner:current_user.username})
    })
  }
  
  createDirect() {
    const prom = new Promise(async (reslove) => {
      let direct = prompt("enter recipients username")
      reslove(await direct)
    })
    prom.then((data) => {
      socket.emit("create_direct", {users:[current_user.username, data]})
    })
  }
  displaychatroomitems() {
    return this.state.chatrooms.map(i => {
      return <NavbarChatroomItem chatroom={i} username={this.props.username} key={i.chatroom} chatype={"chatrooms"}/>
  })}
  displaydirectitems() {
    return this.state.directData.map((i, index) => {
      return (
         <NavbarDirectItem direct={i} tag={i.users}  key={index}  chatype={"direct"}/>
      );
  })}
  render() {
    return (
      <div className="nav bg-dark">
        <div className="col">
        <div className="d-block">
            <div className="bg-dark card mb-2">
                <h2 className="mb-0">
                  <button className="btn text-left  nav-btn " type="button">
                    <Link to="/home/" >
                      <h5 className="text-info">Home
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-house ml-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/>
                          <path fillRule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"/>
                        </svg>
                      </h5>
                      </Link> 
                  </button>
                </h2>
            </div>
          </div>
          <div className="d-block">
            <div className="bg-dark card mb-2">
                <h2 className="mb-0">
                  <button className="btn text-left  nav-btn " type="button" onClick={this.createChat}>
                    <h5 className="text-info">New Chatroom
                      <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-chat-left-quote ml-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v11.586l2-2A2 2 0 0 1 4.414 11H14a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                        <path fillRule="evenodd" d="M7.066 4.76A1.665 1.665 0 0 0 4 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z"/>
                      </svg>
                    </h5>
                  </button>
                </h2>
            </div>
          </div>
          <div className="d-block">
            <div className="bg-dark card mb-2">
                <h2 className="mb-0">
                  <button className="btn text-left  nav-btn " type="button" onClick={this.createDirect}>
                    <h5 className="text-info">New Direct
                      <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-cursor ml-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103zM2.25 8.184l3.897 1.67a.5.5 0 0 1 .262.263l1.67 3.897L12.743 3.52 2.25 8.184z"/>
                      </svg>
                    </h5>
                  </button>
                </h2>
            </div>
          </div>
          <h4>Chatrooms 
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-chat-left ml-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v11.586l2-2A2 2 0 0 1 4.414 11H14a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            </svg>
          </h4>
          <div className="navBox">
            {this.displaychatroomitems()}
          </div>
          <h4>Directs 
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-cast ml-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.646 9.354l-3.792 3.792a.5.5 0 0 0 .353.854h7.586a.5.5 0 0 0 .354-.854L8.354 9.354a.5.5 0 0 0-.708 0z"/>
              <path d="M11.414 11H14.5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-13a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h3.086l-1 1H1.5A1.5 1.5 0 0 1 0 10.5v-7A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v7a1.5 1.5 0 0 1-1.5 1.5h-2.086l-1-1z"/>
            </svg>
          </h4>
          <div className="navBox mt-4">
            {this.displaydirectitems()}
          </div>
        </div>
      </div>
    );
  }
}
class NavbarChatroomItem extends React.Component {
  
  render() {
    return (
      <Link to={`/chat/${this.props.chatype}/${this.props.chatroom._id}/`}><button className="btn text-left text-info nav-btn mb-2"><h5>{this.props.chatroom.chatroom}</h5></button></Link>
    );
  }
}

class NavbarDirectItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {touser: null}
    this._isMounted = false
  }
  componentDidMount() {
    this._isMounted = true
    const prom = new Promise((resolve) => {
      let dmuser = this.props.tag.filter(word => word !== current_user.username);
      resolve(dmuser)
    })
    prom.then((data) => {
      this.setState({touser:data})
    })
  }
  componentWillUnmount() {
    this._isMounted = false
  }
  render() {
    return (
    <Link to={`/chat/${this.props.chatype}/${this.props.direct._id}/`}><button className="btn text-left text-info nav-btn mb-2">
      <h5>To 
        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-forward-fill mr-1 ml-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.77 12.11l4.012-2.953a.647.647 0 0 0 0-1.114L9.771 5.09a.644.644 0 0 0-.971.557V6.65H2v3.9h6.8v1.003c0 .505.545.808.97.557z"/>
        </svg>
        {this.state.touser}
      </h5>
      </button>
    </Link>
    );
  }
}
class SignInPage extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {user:null ,enabled:false}
    this.loginintoaccount = this.loginintoaccount.bind(this)
  }
  componentDidMount() {
    this._isMounted = true
    socket.on("signin_user", (data) => {
      if (!window.sessionStorage.getItem('user')) {
        window.sessionStorage.setItem('user', JSON.stringify(data));
        current_user = JSON.parse(window.sessionStorage.getItem('user'))[0]
      }
      else {
        window.sessionStorage.removeItem('user');
        window.sessionStorage.setItem('user', JSON.stringify(data));
        current_user = JSON.parse(window.sessionStorage.getItem('user'))[0]

      }
      this.setState({enabled:true})
    })
    socket.on("sign_in_error", () => {
      alert("that account doesnt exist")
    })
  }
  componentWillUnmount(){
    this._isMounted = false
  }
  loginintoaccount(user , password) {
    socket.emit("signin_user", {user:user , password:password})
  }
  render() {
    return (
      <div className="backgoundpage form-page">
        <div className="form-box">
          <FormGroup submit={this.loginintoaccount}  enabled={this.state.enabled}/>
        </div>
      </div>
    );
  } 
}
class SignUpPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {enabled:false}
    this._isMounted = false
    this.createnewuser = this.createnewuser.bind(this)  
    this.isValid = this.isValid.bind(this)
    this.checkstate = this.checkstate.bind(this)
  }

  componentDidMount() {
    this._isMounted = true
    socket.on("create_user", (data) => {
      if (!window.sessionStorage.getItem('user')) {
        window.sessionStorage.setItem('user', JSON.stringify(data));
        current_user = JSON.parse(window.sessionStorage.getItem('user'))

      }
      else {
        window.sessionStorage.removeItem('user');
        window.sessionStorage.setItem('user', JSON.stringify(data));
        current_user = JSON.parse(window.sessionStorage.getItem('user'))
      }
      this.setState({enabled:true})
    })
    socket.on("create_user_faild", () => {
      alert("account already exists")
    })
  }
  componentWillUnmount() {
    this._isMounted = false
  }
  isValid(str){
    if(/^[a-zA-Z0-9- ,_]*$/.test(str) === false){
      return false
  }else {
    return true
  }
  }
  checkstate(username , password) {
    if (!username || !password ){
      return false
    } else {
      if (this.isValid(username)){
        return true
      }
      else{
        return false
      }
    }
  }
  createnewuser(username , password) {
    if (this.checkstate(username , password)) {
      socket.emit("create_user" , {username , password})
  }
  }
  
  render() {
    return (
      <div className="backgoundpage form-page">
        <div className="form-box">
          <FormGroup submit={this.createnewuser} enabled={this.state.enabled}/>
        </div>
      </div>
    );
  }
}
class StartPage extends React.Component {
  render() {
    return (
      <div className="backgoundpage form-page">
        <div className="form-box container">
          <div className="m-5 startpage-container " >
            <div className="col">
              <Link to="/account/signin">
                <button type="button" className="btn m-1 btn-lg btn-block text-info">
                  <div className="row">
                    <h5>Signin</h5>
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className=" bi bi-box-arrow-in-down" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4.646 8.146a.5.5 0 0 1 .708 0L8 10.793l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z"/>
                      <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-1 0v-9A.5.5 0 0 1 8 1z"/>
                      <path fillRule="evenodd" d="M1.5 13.5A1.5 1.5 0 0 0 3 15h10a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 13 4h-1.5a.5.5 0 0 0 0 1H13a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-8A.5.5 0 0 1 3 5h1.5a.5.5 0 0 0 0-1H3a1.5 1.5 0 0 0-1.5 1.5v8z"/>
                    </svg>
                  </div>
                </button>
              </Link>
            </div>
            <div className="col">
              <Link to="/account/signup">
                <button type="button"  className="btn m-1 btn-lg btn-block text-info">
                  <div className="row">
                    <h5 >Siginup</h5>
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-box-arrow-in-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4.646 7.854a.5.5 0 0 0 .708 0L8 5.207l2.646 2.647a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 0 0 0 .708z"/>
                      <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-1 0v9a.5.5 0 0 0 .5.5z"/>
                      <path fillRule="evenodd" d="M1.5 2.5A1.5 1.5 0 0 1 3 1h10a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 13 12h-1.5a.5.5 0 0 1 0-1H13a.5.5 0 0 0 .5-.5v-8A.5.5 0 0 0 13 2H3a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h1.5a.5.5 0 0 1 0 1H3a1.5 1.5 0 0 1-1.5-1.5v-8z"/>
                    </svg>
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


class FormGroup extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    let username = this.usernamebox.value
    let password = this.passwordbox.value
    this.props.submit(username , password)
  }

  render() {
    return (
      <form className="m-5" >
        <div className="row">
          <input type="text" className="form-control form-control-lg" ref={(c) => this.usernamebox = c} placeholder="Username" autoComplete="username"/>
        </div>
        <div className="row">
          <input type="password" className="form-control form-control-lg" ref={(c) => this.passwordbox = c}placeholder="Password" autoComplete="password"/>
        </div>
        <div className="row">
          <Link to="/">
            <button type="button" className="btn mt-2 mr-1 btn-sm text-info">
              <div className="row m-1">
                <h5>Back</h5>
                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-box-arrow-in-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.854 11.354a.5.5 0 0 0 0-.708L5.207 8l2.647-2.646a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708 0z"/>
                  <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0 0 1h9A.5.5 0 0 0 15 8z"/>
                  <path fillRule="evenodd" d="M2.5 14.5A1.5 1.5 0 0 1 1 13V3a1.5 1.5 0 0 1 1.5-1.5h8A1.5 1.5 0 0 1 12 3v1.5a.5.5 0 0 1-1 0V3a.5.5 0 0 0-.5-.5h-8A.5.5 0 0 0 2 3v10a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-1.5a.5.5 0 0 1 1 0V13a1.5 1.5 0 0 1-1.5 1.5h-8z"/>
                </svg>
              </div>
            </button>
          </Link>
          <button type="button" className="btn mt-2 btn-sm text-info" onClick={this.handleClick}>
            <div className="row m-1">
              <h5 >submit</h5>
              <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-box-arrow-in-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.646 7.854a.5.5 0 0 0 .708 0L8 5.207l2.646 2.647a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 0 0 0 .708z"/>
                <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-1 0v9a.5.5 0 0 0 .5.5z"/>
                <path fillRule="evenodd" d="M1.5 2.5A1.5 1.5 0 0 1 3 1h10a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 13 12h-1.5a.5.5 0 0 1 0-1H13a.5.5 0 0 0 .5-.5v-8A.5.5 0 0 0 13 2H3a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h1.5a.5.5 0 0 1 0 1H3a1.5 1.5 0 0 1-1.5-1.5v-8z"/>
              </svg>
            </div>
          </button>
          {this.props.enabled ? <Link to={`/home/`}>
          <button type="button" className={`btn mt-2 ml-1  btn-sm ${this.props.enabled ? "text-info" : "disabled"}`}>
            <div className="row m-1">
              <h5>continue</h5>
              <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-box-arrow-in-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8.146 11.354a.5.5 0 0 1 0-.708L10.793 8 8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0z"/>
                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 1 8z"/>
                <path fillRule="evenodd" d="M13.5 14.5A1.5 1.5 0 0 0 15 13V3a1.5 1.5 0 0 0-1.5-1.5h-8A1.5 1.5 0 0 0 4 3v1.5a.5.5 0 0 0 1 0V3a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 5 13v-1.5a.5.5 0 0 0-1 0V13a1.5 1.5 0 0 0 1.5 1.5h8z"/>
              </svg>
            </div>
          </button>
            </Link>:<button type="button" className={`btn mt-2 ml-1 btn-sm ${this.props.enabled ? "" : "disabled"}`}>
            <div className="row m-1">
              <h5>continue</h5>
              <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-box-arrow-in-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8.146 11.354a.5.5 0 0 1 0-.708L10.793 8 8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0z"/>
                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 1 8z"/>
                <path fillRule="evenodd" d="M13.5 14.5A1.5 1.5 0 0 0 15 13V3a1.5 1.5 0 0 0-1.5-1.5h-8A1.5 1.5 0 0 0 4 3v1.5a.5.5 0 0 0 1 0V3a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 5 13v-1.5a.5.5 0 0 0-1 0V13a1.5 1.5 0 0 0 1.5 1.5h8z"/>
              </svg>
            </div>
          </button>}
        </div>
      </form>
    );
  }
}


ReactDOM.render(<App />, document.getElementById("root"));
