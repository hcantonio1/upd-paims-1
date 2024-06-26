import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import { navigate } from "gatsby";
import { isLoggedIn, logout } from "../../services/auth";
import * as styles from "../../styles/header.module.css";
import { Box, Button, Typography } from "@mui/material";

const Header = () => {
  const handleLogout = (event) => {
    if (!isLoggedIn()) return false;
    event.preventDefault();
    logout(() => {
      navigate(`/app/login`);
    });
  };

  return (
    <header className={styles.header}>
      {/* header container  */}
      <Box display="flex" flexDirection="column">
        {/* logo - log out button container  */}
        <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
          {/* logo  */}
          <StaticImage className={styles.logo} alt="Logo" src="../../images/coe_logo.png" />

          {/* webapp title  */}
          <Box flexGrow={10}>
            <Typography variant="h6">Properties Accountabilites and Inventory Management System</Typography>
          </Box>

          {/* log out button  */}
          <Box display="flex" flexDirection="row" justifyContent="center" flexGrow={1}>
            <Button
              onClick={handleLogout}
              variant="contained"
              sx={{
                margin: 4,
                background: "#014421",
                color: "#ffffff",
                borderRadius: 5,
                "&:hover": {
                  backgroundColor: "#3A754E",
                },
              }}
            >
              {" "}
              Log Out{" "}
            </Button>
          </Box>
        </Box>

        {/* container for colored bars */}
        <Box display="flex" flexDirection="column">
          {/* green bar  */}
          <Box className={styles.green_rectangle} />

          {/* yellow bar  */}
          <Box className={styles.yellow_rectangle} />
        </Box>
      </Box>
    </header>
  );
};

export default Header;
