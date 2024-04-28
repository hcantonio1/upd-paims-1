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
    <Box display="flex" flexDirection="column" sx={{ height: "100vh" }}>
      {/* title and logo section  */}
      <Box display="flex" flexDirection="row" justifyContent="center">
        {/* logo  */}
        <StaticImage className={styles.logo} alt="Logo" src="../../images/coe_logo.png" />

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

        <StaticImage className={styles.logo} alt="LogoUPD" src="../../images/upd_logo.png" />
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
      <Box display="flex" flexDirection="row" justifyContent="center" sx={{ height: "100%", bgcolor: "#7b1113" }}>
        {/* white box  */}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          sx={{ bgcolor: "#ffffff", height: 350, width: 500, mt: 9, borderRadius: 7 }}
        >
          <form
            method="post"
            onSubmit={(event) => {
              handleSubmit(event);
              navigate(`/app/home`);
            }}
          >
            <Box display="flex" flexDirection="column" justifyContent="center" sx={{ gap: 1 }}>
              {/* username field  */}
              <TextField
                sx={{ mx: "auto", width: "70%" }}
                type="text"
                name="email"
                label="Email"
                onChange={handleUpdate}
                variant="outlined"
                size="small"
              />

              {/* password field  */}

              <TextField
                sx={{ mx: "auto", width: "70%" }}
                name="password"
                label="Password"
                type="password"
                onChange={handleUpdate}
                variant="outlined"
                size="small"
              />

              {/* login button  */}
              <Button
                type="submit"
                value="Log In"
                variant="contained"
                sx={{
                  backgroundColor: "#014421",
                  color: "#ffffff",
                  marginLeft: 10,
                  width: 340,
                  borderRadius: 60,
                  "&:hover": {
                    backgroundColor: "#3A754E",
                  },
                }}
              >
                Log In
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
