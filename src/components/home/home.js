import React from "react";
import Layout from "../common/layout";
// import * as styles from "../../styles/index.module.css";
import { getUser } from "../../services/auth";
import { Box, Typography, makeStyles } from "@material-ui/core";
import { AccountCircle, Build } from "@material-ui/icons";

const useStyles = makeStyles({
  root: {
    padding: 20,
  },

  userInfo: {
    backgroundColor: "#e5e5e5",
  },

  changeLogTextContainer: {
    backgroundColor: "#e5e5e5",
    padding: 20,
  },

  changeLogText: {
    fontWeight: "bold",
  },

  userText: {
    fontWeight: "bold",
    margin: 5,
  },

  changeLog: {
    borderStyle: "solid",
    borderColor: "#e5e5e5",
  },

  recentChangesText: {
    fontStyle: "italic",
  },

  roleText: {
    fontWeight: "bold",
    padding: 5,
  },

  icons: {
    marginTop: 8,
    marginLeft: 8,
  },

  email: {
    marginTop: 5,
    marginBottom: 5,
  },
});

const HomePage = () => {
  const classes = useStyles();

  return (
    <Layout pageTitle="DASHBOARD">
      {/* home content container  */}
      <Box
        display="flex"
        flexDirection="column"
        className={classes.root}
        sx={{
          rowGap: 20,
        }}
      >
        {/* user information container  */}
        <Box display="flex" flexDirection="column">
          {/* hello user  */}
          <Typography variant="h6" className={classes.userText}>
            Hello, {getUser().firstname}!
          </Typography>

          {/* username container  */}
          <UserDetailDisplay
            IconComponent={AccountCircle}
            entryLabel="User"
            entryValue={getUser().email}
          />
        </Box>

        <UserDetailDisplay
          IconComponent={Build}
          entryLabel="Department"
          entryValue={getUser().dept}
        />
        {/* role container  */}
        <UserDetailDisplay
          IconComponent={Build}
          entryLabel="Role"
          entryValue={getUser().role}
        />
        {/* changelog container  */}
        <Box display="flex" flexDirection="column">
          {/* changelog text  */}
          <Box className={classes.changeLogTextContainer}>
            <Typography variant="h6" className={classes.changeLogText}>
              Changelog
            </Typography>
          </Box>

          {/* recent changes container  */}
          <Box className={classes.changeLog}>
            <Typography align="center" className={classes.recentChangesText}>
              No recent changes have been made.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default HomePage;

const UserDetailDisplay = ({ IconComponent, entryLabel, entryValue }) => {
  const classes = useStyles();
  return (
    <Box display="flex" flexDirection="row" className={classes.userInfo}>
      <IconComponent className={classes.icons} />
      <Box>
        <Typography variant="h6" className={classes.roleText}>
          {entryLabel}:
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6" className={classes.email}>
          {entryValue}
        </Typography>
      </Box>
    </Box>
  );
};
