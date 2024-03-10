import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import { Link, navigate } from "gatsby";
import { getUser, isLoggedIn, logout } from "../services/auth";
import * as styles from "../styles/header.module.css";
import { Typography, Box, AppBar, Toolbar, makeStyles, Grid } from "@material-ui/core"

const useStyles = makeStyles({
  appbar: {

  }
})
const Header = () => {
  const handleLogout = (event) => {
    if (!isLoggedIn()) return false;
    event.preventDefault();
    logout(() => navigate(`/app/login`));
  };

  return (


    <header className={styles.header}>
      {/* header container  */}
      <Box
        display='flex'
        flexDirection='column'
      >
        {/* logo - log out button container  */}
        <Box
          display='flex'
          flexDirection='row'
          justifyContent='center'
          alignItems='center'
        >

          {/* logo  */}
          <StaticImage
            className={styles.logo}
            alt="Logo"
            src="../images/coe_logo.png"
          />

          {/* webapp title  */}
          <Box
            flexGrow={10}
          >
            <Typography>
              Properties Accountabilites and&nbsp;Inventory Management System
            </Typography>
          </Box>

          {/* log out button  */}
          <Box>
            <button className={styles.logoutbutton} onClick={handleLogout}>
              {" "}
              Log Out{" "}
            </button>
          </Box>
        </Box>

        {/* container for colored bars */}
        <Box
          display='flex'
          flexDirection='column'
        >
          {/* green bar  */}
          <Box className={styles.green_rectangle}/>


          {/* yellow bar  */}
          <Box className={styles.yellow_rectangle} />
        </Box>
      </Box>
    </header>
  );
};

export default Header;
