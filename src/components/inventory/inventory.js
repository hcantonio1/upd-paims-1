import React, { useEffect, useState } from "react";
import Layout from "../common/layout.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase-config.js";
import { Box, Link, Button } from "@mui/material";
import InventoryTable from "../inventory/inventoryTable.js";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { getUser } from "../../services/auth.js";

const InventoryPage = () => {
  const [isGridVisible, setIsGridVisible] = useState(false);

  const toggleGridVisibility = () => {
    setIsGridVisible(!isGridVisible);
  };

  // const emptyText

  const normalFilter = (row) => {
    return row.isArchived !== 1 && row.isApproved !== 0;
  };

  const archivedFilter = (row) => {
    return row.isArchived !== 0 && row.isApproved !== 0;
  };

  const onArchiveClick = async (e, row) => {
    e.stopPropagation();
    try {
      console.log("HUH", row);
      const propertyDocRef = doc(db, "property", row.PropertyID.toString());
      await updateDoc(propertyDocRef, {
        isArchived: 1,
      });
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  const onUnarchiveClick = async (e, row) => {
    e.stopPropagation();
    try {
      console.log("HUH", row);
      const propertyDocRef = doc(db, "property", row.PropertyID.toString());
      await updateDoc(propertyDocRef, {
        isArchived: 0,
      });
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  return (
    <Layout pageTitle="INVENTORY">
      <main>
        <div>
          <InventoryTable filterCondition={normalFilter} buttonLabel="Archive" onButtonClick={onArchiveClick} noLabelText={true} />
        </div>
        <div>
          <Button onClick={toggleGridVisibility}>{isGridVisible ? "Hide Archive" : "Show Archive"}</Button>
          {isGridVisible && <InventoryTable filterCondition={archivedFilter} buttonLabel="Unarchive" onButtonClick={onUnarchiveClick} noLabelText={true} />}
        </div>
      </main>
    </Layout>
  );
};

export const Head = () => <title>Inventory Page</title>;
export default InventoryPage;
