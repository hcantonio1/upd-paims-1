import React, { useEffect, useState } from "react";
import Layout from "../common/layout.js";
import SearchBar from "../common/searchbar.js";
import FilterBy from "../common/filter.js";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase-config.js";
import { commonCollections } from "../../services/prefetch.js";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import firebase from "firebase/app";
import "firebase/database";

// This is for sample table, ignore
const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "firstName",
    headerName: "First name",
    width: 150,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 150,
    editable: true,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 110,
    editable: true,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

// ^For sample table, ignore

const propertiesCollection = collection(db, "property");

function DataTable({ data, columns, onSort, sortedField }) {
  // For Layout
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    margin: "20px 0",
    background: "white",
  };

  const tdStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
  };

  const renderHeader = (column) => (
    <th
      key={column.key}
      onClick={() => onSort(column.key)}
      style={{
        padding: "8px",
        cursor: "pointer",
        borderBottom: "2px solid #ccc",
        backgroundColor: sortedField === column.key ? "#f2f2f2" : "transparent",
        position: "relative",
      }}
    >
      {column.label}
      {sortedField === column.key && (
        <span
          style={{
            position: "absolute",
            top: "50%",
            right: "8px",
            transform: "translateY(-50%)",
          }}
        >
          {sortedField === column.key ? "↑" : "↓"}
        </span>
      )}
    </th>
  );

  return (
    <div>
      <table style={tableStyle}>
        <thead>
          <tr>{columns.map((column) => renderHeader(column))}</tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key} style={tdStyle}>
                  {/* check if the column key is DocumentID */}
                  {column.key === "DocumentID" &&
                  typeof item[column.key] === "object"
                    ? // render the value using TrusteeID from the same row as the key for DocumentID object
                      item[column.key][item["TrusteeID"]]
                    : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const InventoryPage = () => {
  const InventoryColumns = [
    { key: "PropertyID", label: "Property ID", filterable: true },
    { key: "PropertyName", label: "Name", filterable: true },
    { key: "CategoryName", label: "Category", filterable: true },
    { key: "StatusName", label: "Status", filterable: true },
    {
      key: "TrusteeID",
      label: "Trustee ID",
      filterable: true,
    },
    { key: "LocationName", label: "Location", filterable: true },
    { key: "PurchaseOrderID", label: "Purchase Order", filterable: true },
    { key: "SupplierID", label: "Supplier", filterable: true },
    { key: "Address", label: "Address", filterable: true },
    { key: "DocumentID", label: "Document", filterable: true },
    { key: "InvDate", label: "Date Issued", filterable: true },
  ];

  // function getVerNum(row){
  //   return row.VerNum;
  // }

  // const flattenICS = (row) => {
  //   const ics = row.icsID || {}; // Ensure ics is an object, or use an empty object if it's null or undefined
  //   const flattenedICS = Object.entries(ics).reduce((acc, [key, value]) => {
  //     acc[key] = value;
  //     return acc;
  //   }, {});
  //   return flattenedICS;
  // };
  // const flattenedICS = flattenICS(row);
  // console.log(flattenedICS); 

  const InvCol = [
    { field: "PropertyID", headerName: "ID", width: 90 },
    { field: "PropertyName", headerName: "Name", width: 150 },
    { field: "CategoryName", headerName: "Category", width: 90 },
    { field: "StatusName", headerName: "Status", width: 150 },
    { field: "TrusteeID", headerName: "Trustee ID", width: 90 },
    { field: "LocationName", headerName: "Location", width: 150 },
    { field: "PurchaseOrderID", headerName: "Purchase Order", width: 90 },
    { field: "SupplierID", headerName: "Supplier", width: 150 },
    { field: "VerNum", headerName: "VER", width: 150 
      // ,valueGetter: (value) => { return value } 
      ,valueGetter: (param, row) => {
        return `${row.icsID.VerNum || 'AAA'} ${row.PropertyName || ''}`;
      }, 
    },

    { field: "icsID", headerName: "ICS", width: 150,   
    valueGetter: (params, row) => {
      const propertyName = `${row.VerNum}`;
      console.log("PROPNAMEAAA", propertyName);
      console.log(typeof(propertyName));
      console.log(`row.icsID.${row.VerNum}`);
      console.log(row.icsID[row.VerNum]);
      console.log(row.icsID[propertyName]);
      const propValue = `row.icsID.${row.VerNum}`;
      
  
      return propValue;
    } 

    // valueGetter: (row) => {
    //   const propertyName = `${row.VerNum}`;
    //   console.log("PROPNAME", propertyName);
    
    //   // Check if `icsID` is present
    //   if (row.icsID) {
    //     // Check if the property exists within `icsID`
    //     if (row.icsID[propertyName] !== undefined) {
    //       console.log(row.icsID[propertyName]);
    //       return row.icsID[propertyName];
    //     } else {
    //       // Handle case when the property is not present within `icsID`
    //       console.log(`Property ${propertyName} does not exist within icsID`);
    //       return ""; // or any default value you want to return
    //     }
    //   } else {
    //     // Handle case when `icsID` itself is not present
    //     console.log("icsID is not present");
    //     return ""; // or any default value you want to return
    //   }
    // }
  
  
  
  },





    // { field: "icsID", headerName: "ICS", width: 150,   
    //   valueGetter: (params) => {
    //   const { row } = params;
    //   // Check if row.icsID is not null and not an empty object
    //   if (row?.icsID && Object.keys(row?.icsID).length > 0) {
    //     const flattenedValues = Object.keys(row?.icsID).flatMap(key => {
    //       const value = row.icsID[key];
    //       return value !== null ? value : [];
    //     });
    //     console.log(flattenedValues);
    //     // Assuming there's only one value in this case
    //     const value = flattenedValues[0]; // Access the first non-null value
    //     return value;
    //   }
    //   return ""; // Return empty string if row.icsID is null or empty
    // } },

    // valueGetter: (params) => {
    //   const { row } = params;
    //   const propertyName = `${row?.icsID}`;
    //   console.log(propertyName);
    //   console.log(typeof(propertyName));
    //   return row?.icsID?.[propertyName];
    // } },
    // { field: "icsID", headerName: "ICS", width: 150, 
    //   valueGetter: (params) => {
    //     return params.row.VerNum }},

    // { field: 'InvDate', headerName: 'Trustee Date Issued', width: 90 },
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
          // let newAttr; // Declare newAttr variable
          // if (columnNameOfID === "icsID" || columnNameOfID === "parID" || columnNameOfID === "iirupID") {
          //   console.log("what am i looking at", columnNameOfID);
          //   newAttr = "VerNum";
          // } else {
          //   newAttr = columnNameOfID.slice(0, -2) + "Name"; // Default behavior for other attributes
          // }
          const replacementName = String(prefetched[name][id]);
          // let replacementName = ""; // Default to empty string
          // if (prefetched[name][id]) {
          //   replacementName = prefetched[name][id]; // If value exists, use it
          // }
          console.log("ID:", id);
          console.log("New Attribute:", newAttr);
          console.log("Replacement Name:", replacementName);
          row = { ...row, [newAttr]: replacementName };
        });
        if (row.isArchived !== 1) {
          // Filter out archived items here
          invData.push(row);
        }
      });

      // or query a userRole-specific items (do in /src/services/prefetch.js)
      // const q = query(propertiesCollection, where("PropertyTrustee", "==", "MyName"));

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
    <Layout pageTitle="INVENTORY">
      <main>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <SearchBar onSearch={handleSearch} />
          {/* <FilterBy
            options={filterableColumns.map((column) => column.label)}
            onFilterChange={handleFilterChange}
          /> */}
        </div>
        {/* <div>
          {searchResultsEmpty ? (
            <p style={{ textAlign: "center" }}>No records found.</p>
          ) : (
            <DataTable
              data={filteredData.length > 0 ? filteredData : inventoryData}
              columns={InventoryColumns}
              onSort={handleSort}
            />
          )}
        </div> */}
        <div>
          {searchResultsEmpty ? (
            <p style={{ textAlign: "center" }}>No records found.</p>
          ) : (
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
          )}
        </div>
      </main>
    </Layout>
  );
};

export const Head = () => <title>Inventory Page</title>;
export default InventoryPage;

// useEffect(() => {
//   const fetchData = async () => {
//     const propertiesCollection = collection(db, "property");
//     onSnapshot(propertiesCollection, (snapshot) => {
//       const prefetched = JSON.parse(sessionStorage.getItem("prefetched"));

//       let invData = [];
//       snapshot.docs.forEach((doc) => {
//         let row = doc.data();
//         // Add Firestore document ID as the 'id' property
//         row.id = doc.id; // <-- Add this line
//         commonCollections.forEach(({ name, columnNameOfID }) => {
//           const id = row[columnNameOfID];
//           const newAttr = columnNameOfID.slice(0, -2) + "Name";
//           const replacementName = prefetched[name][id];
//           row = { ...row, [newAttr]: replacementName };
//         });
//         if (row.isArchived !== 1) { // Filter out archived items here
//           invData.push(row);
//         }
//       });

//       setInventoryData(invData);
//     });
//   };

//   fetchData();
// }, []);

// useEffect(() => {
//   const fetchData = async () => {
//     const propertiesCollection = collection(db, "property");
//     onSnapshot(propertiesCollection, (snapshot) => {
//       const prefetched = JSON.parse(sessionStorage.getItem("prefetched"));

//       let invData = [];
//       snapshot.docs.forEach((doc) => {
//         let row = doc.data();
//         // Add Firestore document ID as the 'id' property
//         row.id = doc.id; // <-- Add this line
//         commonCollections.forEach(({ name, columnNameOfID }) => {
//           const id = row[columnNameOfID];
//           const newAttr = columnNameOfID.slice(0, -2) + "Name";
//           const replacementName = prefetched[name][id];
//           row = { ...row, [newAttr]: replacementName };
//         });
//         if (row.isArchived !== 1) { // Filter out archived items here
//           invData.push(row);
//         }
//       });

//       setInventoryData(invData);
//     });
//   };

//   fetchData();
// }, []);
