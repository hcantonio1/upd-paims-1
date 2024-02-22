import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import { navigate } from "gatsby";
import { handleLogin, isLoggedIn } from "../services/auth";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as styles from "../styles/login.module.css";

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
      <>
        <div className={styles["login-page"]}>
          <StaticImage
            className={styles.logo}
            alt="Logo"
            src="../images/coe_logo.png"
          />

          <div className={styles.form}>
            <h1>Login to PAIMS</h1>
            <form
              className={styles["login-form"]}
              method="post"
              onSubmit={(event) => {
                this.handleSubmit(event);
                navigate(`/app/home`);
              }}
            >
              <input
                type="text"
                placeholder="Username"
                name="username"
                onChange={this.handleUpdate}
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={this.handleUpdate}
              />
              <button type="submit" value="Log In">
                Login
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default Login;
