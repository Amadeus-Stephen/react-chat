import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";

class SignupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.props.setRedirect(null);
  }
  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value, // updates state with input
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    this.props.signup(
      this.state.username,
      this.state.email,
      this.state.password,
      this.state.confirmPassword
    );
  }
  render() {
    if (this.props.redirectTo) {
      return <Redirect to={{ pathname: this.props.redirectTo }} />;
    } else {
      return (
        <div className="col-md-6 m-auto">
          <div className="card card-body">
            <h1 className="text-center mb-3">
              <i className="fas fa-user-plus"></i> Signup
            </h1>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="text">Name</label>
                <input
                  onChange={this.handleChange}
                  value={this.state.username || ""}
                  id="username"
                  name="usermame"
                  className="form-control"
                  placeholder="Enter Username"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  onChange={this.handleChange}
                  value={this.state.email || ""}
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter Email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  onChange={this.handleChange}
                  value={this.state.password || ""}
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter Password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password2">Confirm Password</label>
                <input
                  type="password"
                  onChange={this.handleChange}
                  value={this.state.confirmPassword || ""}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Re-Enter Password"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Signup
              </button>
            </form>
            <p className="lead mt-4">
              Have An Account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      );
    }
  }
}

export default SignupPage;
