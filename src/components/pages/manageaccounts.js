import React, { useState, useEffect } from "react";
import Layout from "../layout";
import { Box } from "@material-ui/core";
import { db } from "../../../firebase-config.js";
import { onSnapshot, collection } from "firebase/firestore";
import SearchBar from "../searchbar.js";
import FilterBy from "../filter.js";
import AddDeptAccountForm from "../addDeptAccountForm.js";

const ManageAccounts = () => {
  return (
    <Layout pageTitle="Manage Accounts">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Box>
          <h1>Department Accounts</h1>
        </Box>
        <AddDeptAccountForm />
        <AccountsTable />
      </Box>
    </Layout>
  );
};

export default ManageAccounts;

const AccountsTable = () => {
  const usersCollection = collection(db, "user");

  const displayColumns = [
    { key: "UserID", label: "ID", filterable: true },
    { key: "Username", label: "Username", filterable: true },
    { key: "Department", label: "Department", filterable: true },
    { key: "Role", label: "Role", filterable: true },
    { key: "LastName", label: "Last Name", filterable: true },
    { key: "FirstName", label: "First Name", filterable: true },
  ];

  const filterableColumns = displayColumns.filter(
    (column) => column.filterable
  );
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
    <Box>
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
            data={accountsData}
            columns={displayColumns}
            onSort={handleSort}
          />
        )}
      </div>
    </Box>
  );
};

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

// const TutorialText = () => {
//   // TO BE DELETED
//   return (
//     <>
//       <Box>
//         <h1>Inventory Supervisor</h1>
//         <h3>Supervisors, on top of having Encoder access,</h3>
//         <ul>
//           <li>should be able to create and delete Trustee accounts</li>
//           <li>should be able to create and delete Encoder accounts</li>
//         </ul>
//       </Box>
//       <Box>
//         <h1>System Administrator</h1>
//         <h3>The admin</h3>
//         <ul>
//           <li>
//             should be able to create and delete Departments and Inventory
//             Supervisors
//           </li>
//           <li>
//             only has read access, no write or delete, to the properties of the
//             college's departments
//           </li>
//         </ul>
//       </Box>
//     </>
//   );
// };
