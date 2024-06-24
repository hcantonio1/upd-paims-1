import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { auth, db } from "../../../firebase-config.js";
import { onSnapshot, doc, getDoc, collection } from "firebase/firestore";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { getUser } from "../../services/auth.js";

export const DepartmentTable = ({ collectionName }) => {
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
      setUserRoleAndID({ role: data.Role, userID: data.UserID, department: data.Department });
    };
    getUserRoleAndID();
  }, []);

  const colref = collection(db, collectionName);

  const displayCol = columnsToDisplay(collectionName);

  const [tableRows, setTableRows] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    onSnapshot(colref, (snapshot) => {
      let tableRow = [];
      snapshot.docs.forEach((doc, index) => {
        let row = doc.data();
        // row = { ...row, id: `${collectionName}_row${index}` };
        if (isSameDepartment(collectionName, row, userRoleAndID)) tableRow.push(row);
      });
      // console.log(tableRow);
      setTableRows(tableRow);
    });
  }, [userRoleAndID]);

  return (
    <div>
      <Box display="flex" flexDirection="column">
        <Box
          sx={{
            bgcolor: "#e5e5e5",
            padding: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {getTableName(collectionName)}
          </Typography>
        </Box>
        <Box
          sx={{
            borderStyle: "solid",
            borderColor: "#e5e5e5",
          }}
        >
          <DataGrid
            getRowId={(row) => {
              return dataGridHelper.getRowId(collectionName, row);
            }}
            rows={filteredData.length > 0 ? filteredData : tableRows}
            columns={displayCol}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
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
      </Box>
    </div>
  );
};

const getTableName = (collectionName) => {
  const names = { user: "Department Accounts", supplier: "Department Suppliers", item_location: "Department Locations", status: "Property Status", building: "Department Buildings" };
  return names[collectionName];
};

const columnsToDisplay = (collectionName) => {
  if (collectionName === "user") {
    return [
      { field: "UserID", headerName: "ID", width: 100 },
      { field: "Email", headerName: "Email", flex: 1 },
      { field: "Department", headerName: "Department", flex: 1 },
      { field: "Role", headerName: "Role", flex: 1 },
      { field: "LastName", headerName: "Last Name", flex: 1 },
      { field: "FirstName", headerName: "First Name", flex: 1 },
    ];
  } else if (collectionName === "supplier") {
    return [
      { field: "SupplierID", headerName: "ID", width: 100 },
      { field: "SupplierName", headerName: "Name", flex: 1 },
      { field: "SupplierContact", headerName: "Contact Number", flex: 1 },
      { field: "UnitNumber", headerName: "Unit Number", flex: 1 },
      { field: "StreetName", headerName: "Street", flex: 1 },
      { field: "City", headerName: "City", flex: 1 },
      { field: "State", headerName: "Province", flex: 1 },
    ];
  } else if (collectionName === "item_location") {
    return [
      { field: "LocationID", headerName: "ID", width: 100 },
      { field: "RoomNumber", headerName: "Room Number", flex: 1 },
      { field: "Building", headerName: "Building", flex: 1 },
    ];
  } else if (collectionName === "status") {
    return [
      { field: "StatusID", headerName: "ID", width: 100 },
      { field: "StatusName", headerName: "Status", flex: 1 },
      { field: "StatusDesc", headerName: "Description", flex: 1 },
    ];
  } else if (collectionName === "building") {
    // not important
  } else if (collectionName === "item_document") {
    // not the best page to display this
  }
};

const isSameDepartment = (collectionName, row, userRoleAndID) => {
  if (!userRoleAndID) return false;
  if (collectionName === "user") {
    return row.Department === userRoleAndID?.department;
  } else if (collectionName === "supplier") {
    return true;
  } else if (collectionName === "item_location") {
    return getUser()
      .deptBuildings.map((b) => b.Name)
      .includes(row.Building);
  } else if (collectionName === "status") {
    return true;
  } else if (collectionName === "building") {
    // not important
  }
  return false;
};

const dataGridHelper = {
  getRowId: function (collectionName, row) {
    if (collectionName === "user") {
      return `${collectionName}${row.UserID}`;
    } else if (collectionName === "supplier") {
      return `${collectionName}${row.SupplierID}`;
    } else if (collectionName === "item_location") {
      return `${collectionName}${row.LocationID}`;
    } else if (collectionName === "status") {
      return `${collectionName}${row.StatusID}`;
    } else if (collectionName === "building") {
      // not important
    }
  },
};
