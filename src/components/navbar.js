import * as React from "react";
import { Link } from "gatsby";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, makeStyles } from "@material-ui/core"
import * as styles from "../styles/navbar.module.css";
import { HomeRounded } from '@material-ui/icons';

const navbarWidth = 150

const useStyles = makeStyles({
  page: {
    background: '#f9f9f9',
    width: '100%',
  },
  root: {
    display: 'flex',
  },
  drawer: {
    width: navbarWidth,
  },
  drawerPaper: {
    width: navbarWidth,
  },
  active: {
    background: '#f4f4f4'
  }
})

const Navbar = () => {
  const classes = useStyles()

  // These are the list of tabs to be put in the nav bar
  

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
