import React, { useEffect, useState } from "react";
import Layout from "../common/layout.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase-config.js";
import { Box, Typography, Button } from "@mui/material";
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
      <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: 2,
            margin: 1,
            // width: "100%",
            // maxWidth: "100%",
          }}
        >
      <main>

          <div>
          <Box display="flex" flexDirection="column">
            <Box
              sx={{
                bgcolor: "#e5e5e5",
                padding: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Properties
              </Typography>
            </Box>
            <Box
              sx={{
                borderStyle: "solid",
                borderColor: "#e5e5e5",
              }}>
              <InventoryTable filterCondition={normalFilter} buttonLabel="Archive" onButtonClick={onArchiveClick} noLabelText={true} useCollection="property" />
            </Box>
          </Box>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', marginBottom: '10px' }}>
              <Button onClick={toggleGridVisibility} variant="contained" sx={{ color: 'white', bgcolor: '#014421', marginLeft: 'auto' }}>
                {isGridVisible ? "Hide Archive" : "Show Archive"}
              </Button>
            </div>
              {isGridVisible && (
                <div>
                  <Box display="flex" flexDirection="column">
                    <Box
                      sx={{
                        bgcolor: "#e5e5e5",
                        padding: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Archive
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        borderStyle: "solid",
                        borderColor: "#e5e5e5",
                      }}
                    >
                      <InventoryTable
                        filterCondition={archivedFilter}
                        buttonLabel="Unarchive"
                        onButtonClick={onUnarchiveClick}
                        noLabelText={true}
                        useCollection="property"
                      />
                    </Box>
                  </Box>
                </div>
              )}
          </div>
    
        {/* <div>
          <Button onClick={toggleGridVisibility}>{isGridVisible ? "Hide Archive" : "Show Archive"}</Button>
          {isGridVisible && <InventoryTable filterCondition={archivedFilter} buttonLabel="Unarchive" onButtonClick={onUnarchiveClick} noLabelText={true} />}
        </div> */}
      </main>
      </Box>

    </Layout>
  );
};

export const Head = () => <title>Inventory Page</title>;
export default InventoryPage;
