import React, { useEffect, useState } from "react";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../firebase-config.js";
import { commonCollections } from "../../services/prefetch.js";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Link, Button } from "@mui/material";
import { getUser } from "../../services/auth.js";

const InventoryTable = ({ filterCondition, buttonLabel, onButtonClick, noLabelText, useCollection }) => {
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
      // console.log("USERS:", data);
      setUserRoleAndID({ role: data.Role, userID: data.UserID, department: data.Department });
    };
    getUserRoleAndID();
  }, []);

  const propertiesCollection = collection(db, useCollection);

  const renderActionCell = (rowData) => (
    <Button onClick={(e) => onButtonClick(e, rowData.row)} variant="contained" sx={{ color: "white", bgcolor: "#014421" }}>
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
    { field: "UnitOfMeasure", headerName: "Unit", flex: 1 },
    { field: "UnitValue", headerName: "Cost", flex: 1 },
    { field: "PropertyFound", headerName: "isFound?", flex: 1 },
    { field: "PurchaseOrderID", headerName: "Purchase Order", flex: 1 },
    { field: "TotalCost", headerName: "Total Cost", flex: 1 },
    { field: "SupplierName", headerName: "Supplier", flex: 1 },
    { field: "VerNum", headerName: "Version", flex: 1 },
    { field: "Department", headerName: "Department", flex: 1 },
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
    { field: "DateIssued", headerName: "Date Issued", flex: 1 },
    { field: "IssuedBy", headerName: "Issued By", flex: 1 },

    // { field: "actions", headerName: buttonLabel, flex: 1, renderCell: renderActionCell },
  ];

  if (["Supervisor", "Encoder", "Admin"].includes(getUser().role)) {
    InvCol.push({ field: "actions", headerName: buttonLabel, flex: 1, renderCell: renderActionCell });
  }
  useEffect(() => {
    onSnapshot(propertiesCollection, (snapshot) => {
      const prefetched = JSON.parse(sessionStorage.getItem("prefetched"));

      let invData = [];
      snapshot.docs.forEach((doc) => {
        let row = doc.data();
        // console.log(row);

        // below process gets the common name for every id of, say, Trustee, Location, etc.
        commonCollections.forEach(({ name, columnNameOfID }) => {
          let id = row[columnNameOfID];

          if (columnNameOfID == "DocumentID") {
            let id = row.Documents[row.VerNum];
            const itemDocs = String(prefetched[name][id]);
            // console.log("item doc details>>", itemDocs, name, id)
            const parts = itemDocs.split(" ");
            const docLink = parts[0];
            const docIssued = parts[1];
            const docDate = parts.slice(2).join(" ");
            // console.log("WHATS UP REGEX", link, "Num", number, "date", date);

            let newAttr1 = columnNameOfID.slice(0, -2) + "Link";
            row = { ...row, [newAttr1]: docLink };
            let newAttr2 = "DateIssued";
            row = { ...row, [newAttr2]: docDate };
            let newAttr3 = "IssuedBy";
            row = { ...row, [newAttr3]: docIssued };
          } else if (columnNameOfID == "UserID") {
            id = row.TrusteeID;
            const userInfo = String(prefetched[name][id]);
            const [firstName, lastName, department] = userInfo.split(" ");
            const userName = `${firstName} ${lastName}`;
            const userDept = `${department}`;
            // console.log("USER INFO:", userName, userDept );
            let newAttr1 = "TrusteeName";
            row = { ...row, [newAttr1]: userName };
            let newAttr2 = "Department";
            row = { ...row, [newAttr2]: userDept };
          } else if (columnNameOfID == "PurchaseOrderID") {
            id = row.PurchaseOrderID;
            const cost = String(prefetched[name][id]);
            let newAttr = "TotalCost";
            row = { ...row, [newAttr]: cost };
          } else {
            let newAttr = columnNameOfID.slice(0, -2) + "Name";
            let replacementName = String(prefetched[name][id]);
            row = { ...row, [newAttr]: replacementName };
          }
        });

        // below process filters the items that should appear as invData (ie. the table rows)
        const isPropertyOfTrustee = row.TrusteeID === userRoleAndID?.userID;
        const isSameDepartment = row.Department === userRoleAndID?.department;
        const isEncoderOrSupervisor = ["Encoder", "Supervisor", "Admin"].includes(userRoleAndID?.role);
        if (filterCondition(row) && userRoleAndID?.role && isSameDepartment && (isPropertyOfTrustee || isEncoderOrSupervisor)) {
          invData.push(row);
        }
      });
      // console.log(invData);
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
                Department: false,
                DateIssued: false,
                IssuedBy: false,
                TotalCost: false,
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
            ".MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold !important",
              overflow: "visible !important",
            },
            "& .MuiDataGrid-toolbarContainer": {
              // justifyContent: "space-between",
              "& .MuiButton-text": {
                color: "#014421",
              },
              "& .MuiBadge-badge": {
                backgroundColor: "#014421",
              },
            },
          }}
        />
      </Box>
    </div>
  );
};

export default InventoryTable;
