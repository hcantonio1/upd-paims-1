import * as React from "react";
import { Link } from "gatsby";
import * as styles from "../styles/navbar.module.css";

const Navbar = () => {
  return (
    <nav>
      <div className={styles.navcontainer}>
        <Link to="/app/home">Home</Link>
        <Link to="/app/inventory">Inventory</Link>
        <Link to="/app/submitform">Submit Form</Link>
        <Link to="/app/about">FAQ</Link>
        {/* <Link to="/app/account">Account</Link> */}
        {/* <Link to="/app/home">FAQ</Link> */}
      </div>
    </nav>
  );
};

export default Navbar;
