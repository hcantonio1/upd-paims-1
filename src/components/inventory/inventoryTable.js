import React, { useEffect, useState } from "react";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../firebase-config.js";
import { commonCollections } from "../../services/prefetch.js";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Link, Button } from "@mui/material";

const InventoryTable = ({ filterCondition, buttonLabel, onButtonClick, noLabelText }) => {
  const [inventoryData, setInventoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [userRoleAndID, setUserRoleAndID] = useState({ role: "", userID: null });

  useEffect(() => {
    const getUserRoleAndID = async () => {
      try {
        const test = auth.currentUser.email;
      } catch (err) {
        console.log("Error undefined user. Solve this by making states persistent.", err);
        return;
      }
      const email = auth.currentUser.email;
      const docSnap = await getDoc(doc(db, "user", email));
      const data = docSnap.data();
      setUserRoleAndID({ role: data.Role, userID: data.UserID });
    };
    getUserRoleAndID();
  }, []);

  const propertiesCollection = collection(db, "property");

  const renderActionCell = (rowData) => (
    <Button onClick={(e) => onButtonClick(e, rowData.row)} variant="contained" sx={{ color: 'white', bgcolor: '#014421' }}>
      {buttonLabel}
    </Button>
  );

  const noChangelog = "No recent changes";
  const noInventory = "No data available";

  const InvCol = [
    { field: "PropertyID", headerName: "ID", width: 80 },
    { field: "PropertyName", headerName: "Name", flex: 1 },
    { field: "CategoryName", headerName: "Category", width: 100 },
    { field: "StatusName", headerName: "Status", width: 100 },
    { field: "TrusteeName", headerName: "Trustee", width: 100 },
    { field: "LocationName", headerName: "Location", flex: 1 },
    { field: "PurchaseOrderID", headerName: "Purchase Order", flex: 1 },
    { field: "SupplierName", headerName: "Supplier", flex: 1 },
    { field: "VerNum", headerName: "Version", flex: 1 },
    {
      field: "DocumentLink",
      headerName: "Document",
      width: 100,
      renderCell: (rowData) => (
        <Link href={`${rowData.row.DocumentLink}`} target="_blank">
          {rowData.row.Documents[rowData.row.VerNum]}
        </Link>
      ),
    },
    { field: "actions", headerName: buttonLabel, flex: 1, renderCell: renderActionCell },
  ];

  useEffect(() => {
    onSnapshot(propertiesCollection, (snapshot) => {
      const prefetched = JSON.parse(sessionStorage.getItem("prefetched"));

      let invData = [];
      snapshot.docs.forEach((doc) => {
        let row = doc.data();
        // console.log(row);
        commonCollections.forEach(({ name, columnNameOfID }) => {
          let id = row[columnNameOfID];

          if (columnNameOfID == "DocumentID") {
            id = row.Documents[row.VerNum];
            const docLink = String(prefetched[name][id]);
            console.log("LINK>>", docLink)
            let newAttr = columnNameOfID.slice(0, -2) + "Link";
            row = { ...row, [newAttr]: docLink };
          } else if (columnNameOfID == "UserID") {
            id = row.TrusteeID;
            const userName = String(prefetched[name][id]);
            let newAttr = "TrusteeName";
            row = { ...row, [newAttr]: userName };
          } else {
            let newAttr = columnNameOfID.slice(0, -2) + "Name";
            let replacementName = String(prefetched[name][id]);
            row = { ...row, [newAttr]: replacementName };
          }
        });

        const isPropertyOfTrustee = row.TrusteeID === userRoleAndID?.userID;
        const isEncoderOrSupervisor = ["Encoder", "Supervisor", "Admin"].includes(userRoleAndID?.role);
        if (filterCondition(row) && userRoleAndID?.role && (isPropertyOfTrustee || isEncoderOrSupervisor)) {
          invData.push(row);
        }
      });
      setInventoryData(invData);
    });
  }, [filterCondition, buttonLabel, onButtonClick, noLabelText, userRoleAndID]);

  const localeText = noLabelText ? { noRowsLabel: noInventory } : { noRowsLabel: noChangelog };
  // console.log("Labeltext:", noLabelText);

  return (
    <div>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          getRowId={(row) => row.PropertyID + "_" + row.PurchaseOrderID}
          rows={filteredData.length > 0 ? filteredData : inventoryData}
          columns={InvCol}
          localeText={localeText}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
            columns: {
              columnVisibilityModel: {
                VerNum: false,
                actions: !noLabelText,
 
              },
            },
          }}
          pageSizeOptions={[10]}
          checkboxSelection={noLabelText}
          disableRowSelectionOnClick
          disableColumnResize={true}
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              csvOptions: { allColumns: true },
              showQuickFilter: true,
            },
          }}
          sx={{
            padding: 1,
            overflow: "auto",
            '.MuiDataGrid-columnHeaderTitle': { 
              fontWeight: 'bold !important',
              overflow: 'visible !important'
           },
           '& .MuiDataGrid-toolbarContainer': {
            // justifyContent: "space-between",
            '& .MuiButton-text': {
              color: '#014421',
            },
            '& .MuiBadge-badge': {
              backgroundColor: '#014421',
            },
           }
          }}
        />
      </Box>
    </div>
  );
};

export default InventoryTable;
