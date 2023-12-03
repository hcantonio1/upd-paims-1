import * as React from "react";
import { Link } from "gatsby";
import * as styles from "../styles/navbar.module.css";

const Navbar = () => {
  return (
    <nav>
      <div className={styles.navcontainer}>
        <Link to="/app/home">Home</Link>
        <Link to="/inventory">Inventory</Link>
        <Link to="/submitform">Submit Form</Link>
        <Link to="/about">About</Link>
      </div>
    </nav>
  );
};

export default Navbar;
