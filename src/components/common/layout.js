import * as React from "react";
import Navbar from "./navbar";
import Header from "./header";
// import * as styles from "../styles/layout.module.css";
import { Typography, Box } from "@mui/material";

const Layout = ({ pageTitle, children }) => {
  // LAYOUT PROPER
  return (
    // main container
    <Box
      display="flex"
      flexDirection="column"

      sx={{
        // height: "100vh",
        // overflowX: "auto", 
        // overflowY: "auto",
        // border: 'solid',
        // borderColor: 'blue'
      }}
    >
      {/* HEADER */}
      <Header sx={{ margin: 0 }} />

      <Box
        display="flex"
        flexDirection="row"
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
            width: "100%",
            overflowX: "hidden", 
            // overflowY: "auto",
          }}
        >
          {/* Page title */}
          <Typography
            variant="h3"
            // color="#014421"
            sx={{
              color: "#014421",
              mx: 2,
              my: 1,
              fontWeight: "bold",
            }}
          >
            {pageTitle}
          </Typography>

          <Box
            sx={{
              backgroundColor: "#ffffff",
              marginTop: 0,
              mr: 2,
              ml: 2,
              mb: 2,
              // height: "100%",
            }}
          >
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
