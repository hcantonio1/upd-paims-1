import React, { useEffect, useState } from "react";
import Layout from "../common/layout";
import { getUser } from "../../services/auth";
import { Box, Typography } from "@mui/material";
import { AccountCircle, Build } from "@mui/icons-material";
import { db } from "../../../firebase-config.js";
import { commonCollections } from "../../services/prefetch.js";
import { collection, onSnapshot } from "firebase/firestore";
import { DataGrid } from "@mui/x-data-grid";
import UserDetailDisplay from "./userDetailDisplay.js";
import InventoryTable from "../inventory/inventoryTable.js";
import { doc, updateDoc } from "firebase/firestore";
import RestrictedComponent from "../common/restrictedComponent.js";

const HomePage = () => {
  return (
    <Layout pageTitle="DASHBOARD">
      {/* home content container  */}
      <Box
        display="flex"
        flexDirection="column"
        sx={{
          px: 1,
          rowGap: 2,
        }}
      >
        {/* user information container  */}
        <Box display="flex" flexDirection="column">
          {/* hello user  */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              margin: 1,
            }}
          >
            Hello, {getUser().firstname}!
          </Typography>

          {/* username container  */}
          <UserDetailDisplay IconComponent={AccountCircle} entryLabel="User" entryValue={getUser().email} />
        </Box>

        <UserDetailDisplay IconComponent={Build} entryLabel="Department" entryValue={getUser().dept} />
        {/* role container  */}
        <UserDetailDisplay IconComponent={Build} entryLabel="Role" entryValue={getUser().role} />
        {/* changelog container  */}
        <RestrictedComponent restrictedRoles={["Trustee", "Encoder"]}>
          <ChangeLogTable />
        </RestrictedComponent>
      </Box>
    </Layout>
  );
};

export default HomePage;

const ChangeLogTable = () => {
  const noLabelChangelog = "No recent changes";
  const approvedFilter = (row) => {
    return row.isArchived !== 1 && row.isApproved !== 1;
  };
  const onApproveClick = async (e, row) => {
    e.stopPropagation();
    try {
      console.log("HUH", row);
      const propertyDocRef = doc(db, "property", row.PropertyID.toString());
      await updateDoc(propertyDocRef, {
        isApproved: 1,
      });
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  return (
    <Box display="flex" flexDirection="column">
      {/* changelog text  */}
      <Box
        sx={{
          bgcolor: "#e5e5e5",
          padding: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Changelog
        </Typography>
      </Box>

      {/* recent changes container APRL 24 COMMENT: add condition to put back ung No recent changes 
  mmade if there is no pending properties */}
      <Box
        sx={{
          borderStyle: "solid",
          borderColor: "#e5e5e5",
        }}
      >
        {/* <Typography align="center" sx={{fontStyle: "italic"}}>
      No recent changes have been made.
    </Typography> */}
        <InventoryTable filterCondition={approvedFilter} buttonLabel="Approve" onButtonClick={onApproveClick} noLabelText={false} />
      </Box>
    </Box>
  );
};
