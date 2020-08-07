import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";

class LoginPage extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      redirectTo: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.props.setRedirect(null);
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value, //updates the states with the inputs value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.login(this.state.username, this.state.password);
  }

  render() {
    if (this.props.redirectTo) {
      return <Redirect to={{ pathname: this.props.redirectTo }} />;
    } else {
      return (
        <div className="col-md-6 m-auto ">
          <div className="card card-body">
            <h1 className="text-center mb-3">
              <i className="fas fa-sign-in-alt"></i>Login
            </h1>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">username</label>
                <input
                  type="input"
                  onChange={(e) => this.handleChange(e)}
                  value={this.state.username}
                  id="username"
                  name="username"
                  className="form-control"
                  placeholder="Enter username"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  onChange={(e) => this.handleChange(e)}
                  value={this.state.password}
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter Password"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Login
              </button>
            </form>
            <p className="lead mt-4">
              Dont have an account? <Link to="/signup">Signup </Link>
            </p>
          </div>
        </div>
      );
    }
  }
}

export default LoginPage;
