import React, { useEffect, useState } from "react";
import Layout from "../common/layout";
// import * as styles from "../../styles/index.module.css";
import { getUser } from "../../services/auth";
import { Box, Typography, makeStyles } from "@material-ui/core";
import { AccountCircle, Build } from "@material-ui/icons";
import { db } from "../../../firebase-config.js";
import { commonCollections } from "../../services/prefetch.js";
import FilterBy from "../common/filter.js";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import firebase from "firebase/app";
import "firebase/database";

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


const propertiesCollection = collection(db, "property");

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

const HomePage = () => {
  const classes = useStyles();



  const InvCol = [
    { field: "PropertyID", headerName: "ID", width: 90 },
    { field: "PropertyName", headerName: "Name", width: 150 },
    { field: "CategoryName", headerName: "Category", width: 90 },
    { field: "StatusName", headerName: "Status", width: 150 },
    { field: "TrusteeID", headerName: "Trustee ID", width: 90 },
    { field: "LocationName", headerName: "Location", width: 150 },
    { field: "PurchaseOrderID", headerName: "Purchase Order", width: 90 },
    { field: "SupplierID", headerName: "Supplier", width: 150 },
  ];

  const filterableColumns = InvCol.filter(
    (column) => column.filterable
  );
  const [inventoryData, setInventoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchResultsEmpty, setSearchResultsEmpty] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "InvPID",
    direction: "asc",
  });

  useEffect(() => {
    onSnapshot(propertiesCollection, (snapshot) => {
      const prefetched = JSON.parse(sessionStorage.getItem("prefetched"));

      let invData = [];
      snapshot.docs.forEach((doc) => {
        let row = doc.data();
        commonCollections.forEach(({ name, columnNameOfID }) => {
          const id = row[columnNameOfID];
          const newAttr = columnNameOfID.slice(0, -2) + "Name";
          const replacementName = String(prefetched[name][id]);

          console.log("ID:", id);
          console.log("New Attribute:", newAttr);
          console.log("Replacement Name:", replacementName);
          row = { ...row, [newAttr]: replacementName };
        });
        if (row.isApproved !== 1) {
          // Filter out archived items here
          invData.push(row);
        }
      });
      setInventoryData(invData);
    });
  }, []);

  const handleSearch = (searchTerm) => {
    console.log("Search Term:", searchTerm);
    console.log("Selected Filter:", selectedFilter);

    const filteredResults = inventoryData.filter((item) => {
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
      return match && item.isArchived !== 1;
    });
    setFilteredData(filteredResults);
    setSearchResultsEmpty(filteredResults.length === 0);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleSort = (columnKey) => {
    const direction =
      columnKey === sortConfig.key && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key: columnKey, direction });
    const sortedResults = [...filteredData].sort((a, b) => {
      const aValue = a[columnKey];
      const bValue = b[columnKey];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });
    setFilteredData(sortedResults);
  };



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

          {/* recent changes container APRL 24 COMMENT: add condition to put back ung No recent changes 
          mmade if there is no pending properties */} 
          <Box className={classes.changeLog}>  
            {/* <Typography align="center" className={classes.recentChangesText}>
              No recent changes have been made.
            </Typography> */}
              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  getRowId={(row) => row.PropertyID + "_" + row.PurchaseOrderID}
                  rows={filteredData.length > 0 ? filteredData : inventoryData}
                  columns={InvCol}
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
          </Box>


          
        </Box>
      </Box>
    </Layout>
  );
};



export default HomePage;
