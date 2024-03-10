import * as React from "react";
import Navbar from "../components/navbar";
import Header from "./header";
import * as styles from "../styles/layout.module.css";
import {
  makeStyles,
  Drawer,
  Typography,
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  Box,
  Grid,
  GridSpacing,
} from "@material-ui/core";
import { HomeRounded, Folder, AddCircleOutline } from "@material-ui/icons";
// import { useNavigate } from "react-router-dom";
import { navigate } from "gatsby";
import RestrictedComponent from "./restrictedComponent";

const navbarWidth = 200;

// CLASSES AND STYLES FOR DESIGNING
const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
  },
  page: {
    background: "#f9f9f9",
    width: "100%",
  },
  root: {
    display: "flex",
  },
  drawer: {
    width: navbarWidth,
  },
  drawerPaper: {
    width: navbarWidth,
  },
  active: {
    background: "#f4f4f4",
  },
  header: {
    margin: 0,
  },
  pageTitleStyle: {
    color: "#014421",
    padding: 10,
    marginTop: 10,
    fontWeight: "bold",
  },
  contentContainer: {
    margin: 10,
    marginTop: 0,
    backgroundColor: "#ffffff",
  },
});

const Layout = ({ pageTitle, children }) => {
  const classes = useStyles(); // FOR STYLING

  // NAVIGATION BAR ITEMS
  const menuItems = [
    {
      text: "Home",
      icon: <HomeRounded />,
      path: "/app/home",
    },

    {
      text: "Inventory",
      icon: <Folder />,
      path: "/app/inventory",
    },

    {
      text: "Submit Form",
      icon: <AddCircleOutline />,
      path: "/app/submitform",
    },
    // {
    //   text: 'Manage Accounts',
    //   icon: null,
    //   path: "/app/manageaccounts/"
    // }

    // to be added once mafinalize na yung faq page
    // {
    //   text: 'FAQ',
    //   icon: <AddCircleOutlineOutlined color="secondary"/>,
    //   path: "/create"
    // },
  ];

  // LAYOUT PROPER
  return (
    // main container
    <Box display="flex" flexDirection="row">
      {/* NAVIGATION BAR CODE */}
      <Box>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{ paper: classes.drawerPaper }}
          anchor="left"
        >
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>

                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <RestrictedComponent>
              <ListItem button onClick={() => navigate("/app/manageaccounts/")}>
                <ListItemIcon></ListItemIcon>

                <ListItemText primary={"Manage Accounts"} />
              </ListItem>
            </RestrictedComponent>
          </List>
        </Drawer>
      </Box>

      {/* NON NAVBAR CONTAINER  */}
      <Grid container direction="column">
        {/* HEADER */}
        <Header className={classes.header} />

        {/* PAGE CONTENT */}
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="stretch"
        >
          {/* Page title */}
          <Grid item>
            <Typography variant="h3" className={classes.pageTitleStyle}>
              {pageTitle}
            </Typography>
          </Grid>

          {/* Content Proper */}
          <Grid item className={classes.contentContainer}>
            {children}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Layout;
