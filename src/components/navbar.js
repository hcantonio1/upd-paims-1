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
import {
  HomeRounded,
  Folder,
  AddCircleOutline,
  AccountCircleRounded,
} from "@material-ui/icons";
import RestrictedComponent from "./restrictedComponent";
import { navigate } from "gatsby";

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
      restrictedRoles: [],
    },

    {
      text: "Inventory",
      icon: <Folder />,
      path: "/app/inventory",
      restrictedRoles: [],
    },

    {
      text: "Submit Form",
      icon: <AddCircleOutline />,
      path: "/app/submitform",
      restrictedRoles: ["Trustee"],
    },
    {
      text: "Manage Accounts",
      icon: <AccountCircleRounded />,
      path: "/app/manageaccounts/",
      restrictedRoles: ["Trustee", "Encoder"],
    },

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
            {menuItems.map((item) => {
              const itemkey = item.text;
              const listItem = (
                <ListItem
                  button
                  key={itemkey}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>

                  <ListItemText primary={item.text} />
                </ListItem>
              );
              if (item.restrictedRoles.length === 0) {
                return listItem;
              }
              return (
                <RestrictedComponent
                  key={itemkey}
                  restrictedRoles={item.restrictedRoles}
                >
                  {listItem}
                </RestrictedComponent>
              );
            })}
          </List>
        </Drawer>
      </Box>
    </nav>
  );
};

export default Navbar;
