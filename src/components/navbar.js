import React, { useState } from "react";
import { Link } from "gatsby";
import {
  makeStyles,
  Drawer,
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  Box,
  Paper,
  Collapse,
} from "@material-ui/core";
import {
  HomeRounded,
  Folder,
  AddCircleOutline,
  AccountCircleRounded,
  ExpandLess,
  ExpandMore
} from "@material-ui/icons";
import RestrictedComponent from "./restrictedComponent";
import { navigate } from "gatsby";
import { collapseClasses } from "@mui/material";

const navbarWidth = 235;

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
  const [isOpen, setOpen] = useState(false)

  const handleDropDown = () => {
    setOpen(!isOpen)
  }

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
      <Box display="flex" flexDirection="column" className={classes.drawerPaper}>
        <List>
          {menuItems.map((item) => {
            const itemkey = item.text;
            const listItem = (
              item.text === "Submit Form" ? (
                // If item.text is "Submit Form", render it as a drop down button
                <>
                  <ListItem
                    button
                    key={itemkey}
                    onClick={() => handleDropDown()}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    {isOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  < Collapse in={isOpen} timeout="auto" >
                    <List disablePadding>
                      <ListItem
                        button
                        onClick={() => {
                          navigate("/app/form_addrec/");
                        }}
                      >
                        {/* <ListItemIcon>
                        <StarBorder />
                        </ListItemIcon>   */}
                        <ListItemText primary="Insert Record" />
                      </ListItem>

                      <ListItem
                        button
                        onClick={() => {
                          navigate("/app/form_updaterec/");
                        }}
                      >
                        {/* <ListItemIcon>
                        <StarBorder />
                        </ListItemIcon>   */}
                        <ListItemText primary="Update/Archive Record" />
                      </ListItem>
                    </List>
                  </Collapse>
                </>
              ) : (
                // If item.text is not "Submit Form", render it as a normal navigation button
                <ListItem
                  button
                  key={itemkey}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              )
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
      </Box>
    </nav >
  );
};

export default Navbar;

