import React, { useState, useEffect } from "react";
import Layout from "../common/layout";
import { Box } from "@mui/material";
import { db } from "../../../firebase-config.js";
import { onSnapshot, collection } from "firebase/firestore";
import SearchBar from "../common/searchbar.js";
import FilterBy from "../common/filter.js";
import AddDeptAccountForm from "./addDeptAccountForm.js";
import { DataGrid } from "@mui/x-data-grid";

const ManageAccounts = () => {
  return (
    <Layout pageTitle="Manage Accounts">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <h1>Department Accounts</h1>
        <AddDeptAccountForm />
        <AccountsTable />
      </Box>
    </Layout>
  );
};

export default ManageAccounts;

const AccountsTable = () => {
  const usersCollection = collection(db, "user");

  const displayCol = [
    { field: "UserID", headerName: "ID", width: 90 },
    { field: "Email", headerName: "Email", width: 150 },
    { field: "Department", headerName: "Department", width: 90 },
    { field: "Role", headerName: "Role", width: 150 },
    { field: "LastName", headerName: "Last Name", width: 90 },
    { field: "FirstName", headerName: "First Name", width: 150 },
  ];

  const filterableColumns = displayCol.filter((column) => column.filterable);
  const [accountsData, setAccountsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchResultsEmpty, setSearchResultsEmpty] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "InvPID",
    direcion: "asc",
  });

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

  const handleSearch = (searchTerm) => {
    console.log("Search Term:", searchTerm);
    console.log("Selected Filter:", selectedFilter);

    const filteredResults = accountsData.filter((item) => {
      const match = Object.entries(item).some(([key, value]) => {
        console.log("Checking:", key, value);
        if (key === selectedFilter) {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (typeof value === "string") {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (typeof value === "number") {
          return value.toString().includes(searchTerm.toLowerCase());
        }
        return false;
      });
      return match;
    });
    setFilteredData(filteredResults);
    setSearchResultsEmpty(filteredResults.length === 0);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  return (
    <Box>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <SearchBar onSearch={handleSearch} />
        {/* <FilterBy
          options={filterableColumns.map((column) => column.label)}
          onFilterChange={handleFilterChange}
  />*/}
      </div>
      <div>
        {searchResultsEmpty ? (
          <p style={{ textAlign: "center" }}>No records found.</p>
        ) : (
          <Box sx={{ height: 400, width: "100%" }}>
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
              checkboxSelection
              disableRowSelectionOnClick
            />
          </Box>
        )}
      </div>
    </Box>
  );
};
