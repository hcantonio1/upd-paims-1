import React from "react";
import { useState } from "react";
import { StaticImage } from "gatsby-plugin-image";
import { navigate } from "gatsby";
import { handleLogin, isLoggedIn } from "../../services/auth";
import { Box, TextField, Typography, makeStyles, Button } from "@material-ui/core";

import * as styles from "../../styles/login.module.css";
const useStyles = makeStyles({
  greenRectangle: {
    width: "100%",
    height: 20,
    backgroundColor: "#014421"
  },

  yellowRectangle: {
    width: "100%",
    height: 5,
    backgroundColor: "#dea80f"
  },

  loginSecRoot: {
    backgroundColor: "#7b1113",
    height: 534
  },

  whiteBox: {
    backgroundColor: "#ffffff",
    height: 350,
    width: 500,
    marginTop: 90,
    borderRadius: '30px'
  },

  titleText: {
    fontWeight: "bold"
  },

  textFieldContainer: {
  },

  emailField: {
    width: 300,
    marginLeft: 80,
    marginBottom: 10,
    border:"none",
    appearance: "none",
    background: "#f2f2f2",
    padding: 20,
    borderRadius: 60,
    fontSize: 15
  },

  loginButton: {
    backgroundColor: "#014421",
    color: "#ffffff",
    marginLeft: 80,
    width: 340,
    borderRadius: 60,
    padding: 10,
    marginTop: 30
  }
})

const Login = () => {
  const [userCred, setUserCred] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(userCred);
  };

  const handleUpdate = (e) => {
    setUserCred({ ...userCred, [e.target.name]: e.target.value });
  };

  const classes = useStyles()

  return (
    <Box
      display="flex"
      flexDirection="column"
    >
      {/* title and logo section  */}
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
      >
        {/* logo  */}
        <StaticImage
          className={styles.logo}
          alt="Logo"
          src="../../images/coe_logo.png"
        />

        {/* title  */}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          {/* college of engineering text  */}
          <Typography variant="h6">University of the Philippines</Typography>
          <Typography variant="h6">College of Engineering</Typography>

          {/* PAIMS text */}
          <Typography
            className={classes.titleText}
            variant="h6"
          >
            Properties Accountabilities and
          </Typography>

          <Typography
            className={classes.titleText}
            variant="h6"
          >
            Inventory Management System
          </Typography>
        </Box>
      </Box>

      {/* green bar  */}
      <Box className={classes.greenRectangle} />

      {/* yellow bar  */}
      <Box className={classes.yellowRectangle} />

      {/* email and password section  */}
      <Box
        display="flex"
        flexDirection="row"
        className={classes.loginSecRoot}
        justifyContent="center"
      >
        {/* white box  */}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          className={classes.whiteBox}
        >
          <form
            method="post"
            onSubmit={(event) => {
              handleSubmit(event);
              navigate(`/app/home`);
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              {/* username field  */}
              <input
                type="text"
                placeholder="Username"
                name="email"
                onChange={handleUpdate}
                className={classes.emailField}
              />

              {/* password field  */}
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleUpdate}
                className={classes.emailField}
              />

              {/* login button  */}
              <Button type="submit" value="Log In"
                className={classes.loginButton}
                variant="contained"
              >
                Log In
              </Button>

            </Box>
          </form>

        </Box>
      </Box>
    </Box>
    // <>
    //   <div className={styles["login-page"]}>
    //     <StaticImage
    //       className={styles.logo}
    //       alt="Logo"
    //       src="../../images/coe_logo.png"
    //     />

    //     <div className={styles.form}>
    //       <h1>Login to PAIMS</h1>
    //       <form
    //         className={styles["login-form"]}
    //         method="post"
    //         onSubmit={(event) => {
    //           handleSubmit(event);
    //           navigate(`/app/home`);
    //         }}
    //       >
    //         <input
    //           type="text"
    //           placeholder="Email"
    //           name="email"
    //           onChange={handleUpdate}
    //         />
    //         <input
    //           type="password"
    //           placeholder="Password"
    //           name="password"
    //           onChange={handleUpdate}
    //         />
    //         <button type="submit" value="Log In">
    //           Login
    //         </button>
    //       </form>
    //     </div>
    //   </div>
    // </>
  );
};

export default Login;
