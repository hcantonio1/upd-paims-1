import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import { Link, navigate } from "gatsby";
import { getUser, isLoggedIn, logout } from "../services/auth";
import * as styles from "../styles/header.module.css";
import { Typography } from "@material-ui/core"

const Header = () => {
  const handleLogout = (event) => {
    if (!isLoggedIn()) return false;
    event.preventDefault();
    logout(() => navigate(`/app/login`));
  };

  return (
    <header className={styles.header}>
      <StaticImage
        className={styles.logo}
        alt="Logo"
        src="https://upload.wikimedia.org/wikipedia/en/5/5a/UP_Diliman_Engineering_Logo.png"
      />
      <Typography>
        Properties, Accountabilites and&nbsp;Inventory Management System
      </Typography>
      <button className={styles.logoutbutton} onClick={handleLogout}>
        {" "}
        Log Out{" "}
      </button>
      <div className={styles.green_rectangle} />
      <div className={styles.yellow_rectangle} />
    </header>
  );
};

export default Header;
