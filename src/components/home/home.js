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
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
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
          padding: 2,
          margin: 1,
        }}
      >
        {/* user information container  */}
        <Box display="flex" flexDirection="column">
          {/* hello user  */}
          <Typography variant="h6" sx={{ fontWeight: "bold", margin: 1 }}>
            Hello, {getUser().firstname}!
          </Typography>

          {/* email container  */}
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
    return true;
  };
  
  const onApproveClick = async (e, row) => {
    e.stopPropagation();
    try {
      // console.log("HUH", row);
      const pendRef = doc(db, "pending_changes", row.PropertyID.toString());
      const pendSnapshot = await getDoc(pendRef);
      const pendData = pendSnapshot.data();
      await setDoc(doc(db, "property", row.PropertyID.toString()), {
        CategoryID: pendData.CategoryID,
        Documents: pendData.Documents,
        isArchived: pendData.isArchived,
        LocationID: pendData.LocationID,
        PropertyID: pendData.PropertyID,
        PropertyName: pendData.PropertyName,
        TrusteeID: pendData.TrusteeID,
        StatusID: pendData.StatusID,
        SupplierID: pendData.SupplierID,
        PurchaseOrderID: pendData.PurchaseOrderID,
        VerNum: pendData.VerNum,
      });
      deleteDoc(pendRef)
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  const onDisproveClick = async (e, row) => {
    e.stopPropagation();
    try {
      // console.log("HUH", row);
      const pendRef = doc(db, "pending_changes", row.PropertyID.toString());
      deleteDoc(pendRef)
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        width: "100",
        overflow: "hidden",
        maxWidth: "100%",
      }}
    >
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
        <InventoryTable filterCondition={approvedFilter} buttonLabel="Approve" buttonLabel2="Deny" onButtonClick={onApproveClick} onButtonClick2={onDisproveClick} noLabelText={false} useCollection="pending_changes" />
      </Box>
    </Box>
  );
};
