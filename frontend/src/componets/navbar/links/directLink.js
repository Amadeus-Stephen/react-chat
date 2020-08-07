import React, { Component } from "react";
import { Link } from "react-router-dom";
class DirectLink extends Component {
  constructor(props) {
    super(props);
    this.state = { touser: null };
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;
    const prom = new Promise((resolve) => {
      let dmuser = this.props.tag.filter(
        (word) => word !== this.props.username
      );
      resolve(dmuser);
    });
    prom.then((data) => {
      this.setState({ touser: data });
    });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    return (
      <Link to={`/chat/`}>
        <button className="btn text-left text-info nav-btn mb-2">
          <h5>
            To
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
              className="bi bi-forward-fill mr-1 ml-1"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.77 12.11l4.012-2.953a.647.647 0 0 0 0-1.114L9.771 5.09a.644.644 0 0 0-.971.557V6.65H2v3.9h6.8v1.003c0 .505.545.808.97.557z" />
            </svg>
            {this.state.touser}
          </h5>
        </button>
      </Link>
    );
  }
}

export default DirectLink;
