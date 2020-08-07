import React, { Component } from "react";
import { Link } from "react-router-dom";

class TopNavbar extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }
  logout(event) {
    event.preventDefault();
    this.props.logout();
  }
  render() {
    const loggedIn = this.props.loggedIn;
    return (
      <nav className="csnav topnav w-100 navbar-dark bg-dark">
        {loggedIn ? (
          <div>
            <button onClick={this.logout} className="btn btn-danger m-1">
              <Link to="#">
                <h5 className="text-white">Logout</h5>
              </Link>
            </button>
          </div>
        ) : (
          <div>
            <button className="btn btn-success m-1">
              <Link to="/login">
                <h5 className="text-white">Login</h5>
              </Link>
            </button>
            <button className="btn btn-primary m-1">
              <Link to="/signup">
                <h5 className="text-white">Signup</h5>
              </Link>
            </button>
          </div>
        )}
      </nav>
    );
  }
}

export default TopNavbar;
