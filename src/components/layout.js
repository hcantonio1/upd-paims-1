import * as React from "react";
import Navbar from "./navbar";
import Header from "./header";
// import * as styles from "../styles/layout.module.css";
import {
  makeStyles,
  Typography,
  Box,
  GridSpacing,
  Button,
} from "@material-ui/core";
import { Grid } from "@mui/material";


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
  active: {
    background: "#f4f4f4",
  },
  header: {
    margin: 0,
  },
  pageTitleStyle: {
    color: "#014421",
    margin: 15,
    fontWeight: "bold",
  },
  contentContainer: {
    margin: 10,
    marginTop: 0,
    backgroundColor: "#ffffff",
  },
  contentSegment: {
    backgroundColor: "e5e5e5"
  }
});

const Layout = ({ pageTitle, children }) => {
  const classes = useStyles(); // FOR STYLING


  // LAYOUT PROPER
  return (
    // main container
    <Box display="flex" flexDirection="column"
      sx={{
        height: '100vh',
        // border: 'solid',
        // borderColor: 'blue'
      }}
    >

      {/* HEADER */}
      <Header className={classes.header} />

      <Box display="flex" flexDirection="row"
        sx={{
          height: "100%",
          // border: "solid"
        }}
      >
        <Navbar />
        {/* PAGE CONTENT */}
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            backgroundColor: "#e5e5e5",
            height: "100%",
            width: "100%"
          }}
        >
          {/* Page title */}
          <Typography variant="h3" className={classes.pageTitleStyle}>
            {pageTitle}
          </Typography>

          <Box sx={{
            backgroundColor: "#ffffff",
            marginTop: 0,
            mr: 2,
            ml: 2,
            mb: 2,
            height: "100%"
          }}>
            {children}
          </Box>
        </Box>
        {/* <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="stretch"
          sx={{ backgroundColor: "#e5e5e5",
          height: "100%",
        }}
        > */}
        {/* Page title */}
        {/* <Grid item>
            <Typography variant="h3" className={classes.pageTitleStyle}>
              {pageTitle}
            </Typography>
          </Grid> */}

        {/* Content Proper */}
        {/* <Grid item sx={{margin: 2, backgroundColor: "#ffffff", marginTop: 0}}>
            <Box>
              {children}
            </Box>
          </Grid>
        </Grid> */}
      </Box>
    </Box>
  );
};

export default Layout;
