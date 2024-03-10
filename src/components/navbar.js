import * as React from "react";
import { Link } from "gatsby";
import {
  makeStyles,
  Drawer,
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  Box,
} from "@material-ui/core";
import { HomeRounded, Folder, AddCircleOutline } from "@material-ui/icons";
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

const Navbar = () => {
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

  return (
    <nav>
      <Box>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{ paper: classes.drawerPaper }}
          anchor="left"
        >
          <List>
            {menuItems.map((item) => (
              <Link to={item.path} key={item.text}>
                <ListItem>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              </Link>
            ))}
            <RestrictedComponent>
              <Link to={"/app/manageaccounts/"}>
                <ListItem>
                  <ListItemIcon></ListItemIcon>
                  <ListItemText primary={"Manage Accounts"} />
                </ListItem>
              </Link>
            </RestrictedComponent>
          </List>
        </Drawer>
      </Box>
    </nav>
  );
};

export default Navbar;
