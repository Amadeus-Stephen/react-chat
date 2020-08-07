import React, { Component } from "react";
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = { redirect: false };
  }
  render() {
    return (
      <div className="background ss4 ">
        <div className="col-md-6 m-auto">
          <div className="card card-body">
            <h1 className="text-center">
              Hello
              {this.props.loggedIn ? ` ${this.props.user}` : " "}
            </h1>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
