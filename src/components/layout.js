import * as React from "react";
import Navbar from "../components/navbar";
import Header from "./header"
import * as styles from "../styles/layout.module.css"
import { makeStyles, Drawer, Typography, ListItem, List, ListItemIcon, ListItemText, AppBar, Toolbar, Box } from "@material-ui/core";
import { HomeRounded, Folder, AddCircleOutline } from '@material-ui/icons';


const navbarWidth = 200

// CLASSES AND STYLES FOR DESIGNING
const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
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
  },
  header: {
    margin: 0
  }
})

const Layout = ({ pageTitle, children }) => {
  const classes = useStyles() // FOR STYLING

  // NAVIGATION BAR ITEMS
  const menuItems = [
    {
      text: 'Home',
      icon: <HomeRounded />,
      path: "/app/home"
    },

    {
      text: 'Inventory',
      icon: <Folder />,
      path: "/app/inventory"
    },

    {
      text: 'Submit Form',
      icon: <AddCircleOutline />,
      path: "/app/submitform"
    },

    // to be added once mafinalize na yung faq page
    // {
    //   text: 'FAQ',
    //   icon: <AddCircleOutlineOutlined color="secondary"/>,
    //   path: "/create"
    // },
  ]

  // LAYOUT PROPER
  return (
    <Box className={classes.root}>

      {/* NAVIGATION BAR CODE */}
      <Box>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{ paper: classes.drawerPaper }}
          anchor="left"
        >
          <List>
            {menuItems.map(item => (
              <ListItem
                button
                key={item.text}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>

                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Box>

      {/* HEADER CODE */}
      <Box>
        <Header className={classes.hea} />
      </Box>

      {/* Page Content */}
      <Box>
        <h2> {pageTitle} </h2>
        <Box>
        <div>{children}</div>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
