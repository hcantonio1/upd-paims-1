import React from "react";
import { useState } from "react";
import { StaticImage } from "gatsby-plugin-image";
import { navigate } from "gatsby";
import { handleLogin, isLoggedIn } from "../../services/auth";

import * as styles from "../../styles/login.module.css";

const Login = () => {
  const [userCred, setUserCred] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(userCred);
  };

  const handleUpdate = (e) => {
    setUserCred({ ...userCred, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className={styles["login-page"]}>
        <StaticImage
          className={styles.logo}
          alt="Logo"
          src="../../images/coe_logo.png"
        />

        <div className={styles.form}>
          <h1>Login to PAIMS</h1>
          <form
            className={styles["login-form"]}
            method="post"
            onSubmit={(event) => {
              handleSubmit(event);
              navigate(`/app/home`);
            }}
          >
            <input
              type="text"
              placeholder="Email"
              name="email"
              onChange={handleUpdate}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleUpdate}
            />
            <button type="submit" value="Log In">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
