import React, { useState, useEffect } from "react";
import Layout from "../common/layout.js";
import { Box, Typography } from "@mui/material";
import { db } from "../../../firebase-config.js";
import { onSnapshot, collection } from "firebase/firestore";
import AddDeptAccountForm from "./addDeptAccountForm.js";
import { DataGrid, GridToolbar} from "@mui/x-data-grid";



const AccountsTable = () => {
  const usersCollection = collection(db, "user");

  const displayCol = [
    { field: "UserID", headerName: "ID", width: 50 },
    { field: "Email", headerName: "Email", width: 250 },
    { field: "Department", headerName: "Department", width: 130 },
    { field: "Role", headerName: "Role", width: 150 },
    { field: "LastName", headerName: "Last Name", width: 150 },
    { field: "FirstName", headerName: "First Name", width: 150 },
  ];

  const [accountsData, setAccountsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);


  useEffect(() => {
    onSnapshot(usersCollection, (snapshot) => {
      let accData = [];
      snapshot.docs.forEach((doc) => {
        accData.push(doc.data());
      });
      setAccountsData(accData);
      sessionStorage.setItem("accountsData", JSON.stringify(accData));
    });
  }, []);

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
                Department Accounts
              </Typography>
            </Box>
            <Box
              sx={{
                borderStyle: "solid",
                borderColor: "#e5e5e5",
              }}>            
              
              <DataGrid
              getRowId={(row) => row.UserID}
              rows={filteredData.length > 0 ? filteredData : accountsData}
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
          </Box>
      </div>
  );
};


const ManageAccounts = () => {
  return (
    <Layout pageTitle="MANAGE ACCOUNTS">
      <Box 
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 2,
          margin: 1,
          width: "100%",
          overflow: "hidden",
          maxWidth: "95%",
        }}>
        <AccountsTable />
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        <AddDeptAccountForm />
        </div>
      </Box>
    </Layout>
  );
};

export default ManageAccounts;