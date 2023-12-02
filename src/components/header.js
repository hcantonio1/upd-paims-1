import React from "react";
import { StaticImage } from "gatsby-plugin-image"
import * as styles from "../styles/header.module.css"

const Header = () => {
  return (
    <header className={styles.header}>
      <StaticImage className={styles.logo}
        alt="Logo"
        src="https://upload.wikimedia.org/wikipedia/en/5/5a/UP_Diliman_Engineering_Logo.png"
      />
      <h2 className={styles.title}>Properties, Accountabilites and&nbsp;Inventory Management System</h2>
      <button className={styles.logoutbutton}> Log Out </button>
    </header>
  );
};

export default Header;
