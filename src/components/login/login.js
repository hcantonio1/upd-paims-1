import React from "react";
import { useState } from "react";
import { StaticImage } from "gatsby-plugin-image";
import { navigate } from "gatsby";
import { handleLogin } from "../../services/auth";
import { Box, Typography, Button, TextField } from "@mui/material";

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
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        height: "100vh",
        // border: "solid"
      }}
    >
      {/* title and logo section  */}
      <Box display="flex" flexDirection="row" justifyContent="center">
        {/* logo  */}
        <StaticImage
          className={styles.logo}
          alt="Logo"
          src="../../images/coe_logo.png"
        />

        {/* title  */}
        <Box display="flex" flexDirection="column" justifyContent="center">
          {/* college of engineering text  */}
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            University of the Philippines College of Engineering
          </Typography>
          <Typography variant="h6"></Typography>

          {/* PAIMS text */}
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Properties Accountabilities and Inventory Management System
          </Typography>
        </Box>

        <StaticImage
          className={styles.logo}
          alt="LogoUPD"
          src="../../images/upd_logo.png"
        />
      </Box>

      {/* green bar  */}
      <Box
        sx={{
          width: "100%",
          height: 20,
          bgcolor: "#014421",
        }}
      />

      {/* yellow bar  */}
      <Box
        sx={{
          width: "100%",
          height: 5,
          bgcolor: "#dea80f",
        }}
      />

      {/* email and password section  */}
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        sx={{ height: "100%", bgcolor: "#7b1113" }}
      >
        {/* white box  */}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          sx={{
            bgcolor: "#ffffff",
            height: 350,
            width: 500,
            mt: 9,
            borderRadius: 7,
          }}
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
              sx={{ gap: 1 }}
            >
              {/* username field  */}
              <TextField
                sx={{ mx: "auto", width: "70%" }}
                type="text"
                name="email"
                label="Email"
                onChange={handleUpdate}
                variant="outlined"
              />

              {/* password field  */}
              <TextField
                sx={{ mx: "auto", width: "70%" }}
                type="text"
                name="password"
                label="Password"
                onChange={handleUpdate}
                variant="outlined"
              />

              {/* login button  */}
              <Button
                type="submit"
                value="Log In"
                // className={classes.loginButton}
                variant="contained"
                sx={{
                  backgroundColor: "#014421",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#3A754E",
                  },
                  marginLeft: 10,
                  width: 340,
                  borderRadius: 60,
                }}
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
