import React from "react";
import Layout from "../layout";
// import * as styles from "../../styles/index.module.css";
import { getUser } from "../../services/auth";
import { Box, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    padding: 20,
  },

  userInfo: {
    backgroundColor: '#e5e5e5',
    padding: 20
  },

  changeLogTextContainer: {
    backgroundColor: '#e5e5e5',
    padding: 20,
  },

  changeLogText: {
    fontWeight: 'bold'
  },

  userText: {
    fontWeight: 'bold'
  },

  changeLog: {
    borderStyle: 'solid',
    borderColor: '#e5e5e5',
  },

  recentChangesText: {
    fontStyle: 'italic'
  }
})

const HomePage = () => {
  const classes = useStyles()

  return (
    <Layout pageTitle="DASHBOARD">
      {/* home content container  */}
      <Box
        display='flex'
        flexDirection='column'
        className={classes.root}
        sx={{
          rowGap: 40
        }}
      >
        {/* user information container  */}
        <Box
          display='flex'
          flexDirection='row'
          className={classes.userInfo}
        >
          {/* user icon  */}
          <Box>

          </Box>

          {/* username  */}
          <Box>
            <Typography
              variant='h6'
              className={classes.userText}
            >
              User:
            </Typography>
          </Box>

          <Box>
            <Typography
              variant='h6'
            >
              {getUser().email}
            </Typography>
          </Box>
        </Box>

        {/* changelog container  */}
        <Box
          display='flex'
          flexDirection='column'
        >
          {/* changelog text  */}
          <Box
            className={classes.changeLogTextContainer}
          >
            <Typography
              variant='h6'
              className={classes.changeLogText}
            >
              Changelog
            </Typography>
          </Box>

          {/* recent changes container  */}
          <Box
            className={classes.changeLog}
          >
            <Typography
              align='center'
              className={classes.recentChangesText}
            >
              No recent changes have been made.
            </Typography>
          </Box>
        </Box>
      </Box>
      {/* <main>
        <div>
          <h1>Hello User!</h1>
          <p>Your profile:</p>
          <ul>
            <li>E-mail: {getUser().email}</li>
            <li>Role: {getUser().role}</li>
          </ul>
        </div>
        <div>
          <p>Changelog (tentative):</p>
        </div>
        <div></div>
      </main> */}
    </Layout>
  );
};

export default HomePage;
