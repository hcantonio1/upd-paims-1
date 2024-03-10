import * as React from "react";
import Navbar from "../components/navbar";
import Header from "./header";
// import * as styles from "../styles/layout.module.css";
import {
  makeStyles,
  Typography,
  Box,
  Grid,
  GridSpacing,
} from "@material-ui/core";
// import { useNavigate } from "react-router-dom";

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

  // LAYOUT PROPER
  return (
    // main container
    <Box display="flex" flexDirection="row">
      <Navbar />

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
