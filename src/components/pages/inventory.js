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
                  {item[column.key]}
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
    { key: "CategoryID", label: "Category ID", filterable: true },
    { key: "StatusID", label: "Status", filterable: true },
    {
      key: "PropertySupervisorID",
      label: "Property Supervisor ID",
      filterable: true,
    },
    { key: "LocationID", label: "Location ID", filterable: true },
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
      // populate with all data
      const invData = [];
      snapshot.docs.forEach((doc) => {
        invData.push(doc.data());
      });
      console.log(invData);
      setInventoryData(invData);

      // or populate with account-specific data
      // const q = query(propertiesCollection, where("PropertyTrustee", "==", "MyName"));
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
      return match;
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
      </main>
    </Layout>
  );
};

export const Head = () => <title>Inventory Page</title>;
export default InventoryPage;
