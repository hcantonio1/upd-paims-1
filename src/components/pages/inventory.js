import React, { useEffect, useState } from "react";
import Layout from "../layout.js";
import SearchBar from "../searchbar.js";
import FilterBy from "../filter.js";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase-config.js";
import { commonCollections } from "../../services/prefetch.js";
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';


const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];





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
                  {column.key === "DocumentID" && typeof item[column.key] === "object" ? (
                    // render the value using TrusteeID from the same row as the key for DocumentID object
                    item[column.key][item["TrusteeID"]]
                  ) : (
                    item[column.key]
                  )}
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
    // { key: 'Address', label: 'Address', filterable: true  },
    { key: "DocumentID", label: "Document", filterable: true },
    // { key: "InvDate", label: "Date Issued", filterable: true },
  ];

  const filterableColumns = InventoryColumns.filter(
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
          const replacementName = prefetched[name][id];
          row = { ...row, [newAttr]: replacementName };
        });
        if (row.isArchived !== 1) { // Filter out archived items here
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
          <FilterBy
            options={filterableColumns.map((column) => column.label)}
            onFilterChange={handleFilterChange}
          />
        </div>
        <div>
          {searchResultsEmpty ? (
            <p style={{ textAlign: "center" }}>No records found.</p>
          ) : (
            <DataTable
              data={filteredData.length > 0 ? filteredData : inventoryData}
              columns={InventoryColumns}
              onSort={handleSort}
            />
          )}
        </div>
        <div>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
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
        </div>
      </main>
    </Layout>
  );
};





export const Head = () => <title>Inventory Page</title>;
export default InventoryPage;