import React from "react";
import Layout from "./layout";
import { navigate } from "gatsby";
import { handleLogin, isLoggedIn } from "../services/auth";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Login extends React.Component {
  state = {
    username: ``,
    password: ``,
  };

  handleUpdate = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    handleLogin(this.state);
  };

  render() {
    if (isLoggedIn()) {
      navigate(`/app/home`);
    }

    return (
      <Layout>
        <h1>Log in</h1>
        <form
          method="post"
          onSubmit={(event) => {
            this.handleSubmit(event);
            navigate(`/app/home`);
          }}
        >
          <label>
            Username
            <input type="text" name="username" onChange={this.handleUpdate} />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              onChange={this.handleUpdate}
            />
          </label>
          <input type="submit" value="Log In" />
        </form>
      </Layout>
    );
  }
}

export default Login;
