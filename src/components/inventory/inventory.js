import React, { useEffect, useState } from "react";
import Layout from "../common/layout.js";
import SearchBar from "../common/searchbar.js";
import FilterBy from "../common/filter.js";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../firebase-config.js";
import { commonCollections } from "../../services/prefetch.js";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import firebase from "firebase/app";
import "firebase/database";
import { doc, getDoc } from "firebase/firestore";
import { Redirect} from "react-router-dom";
import Link from '@mui/material/Link';




const InventoryPage = () => {
  const [link, setLink] = useState(null);
  const [rows, setRows] = useState([]);

  

  const InvCol = [
    { field: "PropertyID", headerName: "ID", width: 90 },
    { field: "PropertyName", headerName: "Name", width: 150 },
    { field: "CategoryName", headerName: "Category", width: 90 },
    { field: "StatusName", headerName: "Status", width: 150 },
    { field: "TrusteeID", headerName: "Trustee ID", width: 90 },
    { field: "LocationName", headerName: "Location", width: 150 },
    { field: "PurchaseOrderID", headerName: "Purchase Order", width: 90 },
    { field: "SupplierName", headerName: "Supplier", width: 150 },
    {
      field: "DocumentID",
      headerName: "AAADocument",
      width: 150,
      valueGetter: (params, row) => {
        const propertyName = `${row.VerNum}`;
        // console.log("PROPNAMEAAA", propertyName);
        // console.log(typeof propertyName);
        // console.log(`row.Documents.${row.VerNum}`);
        // console.log("what #1", row.icsID[row.VerNum]);
        // console.log("what #2", row.icsID[propertyName]);
        const propValue = `row.Documents.${row.VerNum}`;

        return row.Documents[row.VerNum];
      },
    },

    {
      field: "DocumentLink",
      headerName: "Playground",
      width: 150,
      renderCell: rowData =>
        <Link href={`${rowData.row.DocumentLink}`} target="_blank">
          {
          // console.log("HEYHOTHISISWHAT", rowData.row.DocumentLink)
          rowData.row.Documents[rowData.row.VerNum]
          }
        </Link>
    },

    // { field: "Link", headerName: "Link", width: 150
    //   , renderCell: (params) => (
    //     <Link to={`/form/${params.value}`}>{params.value}</Link>
    //   )
    // },

    // {
    //   field: 'Link', // Field name for the new column
    //   headerName: 'Link', // Header for the new column
    //   width: 150,
    //   valueGetter: async (params, row) => {
    //     // Fetch data from another collection based on some key or field
    //     const propertyName = `${row.VerNum}`;
    //     console.log("PROPNAMEAAA", propertyName);
    //     console.log(typeof propertyName);
    //     console.log(`row.Documents.${row.VerNum}`);
    //     // console.log("what #1", row.icsID[row.VerNum]);
    //     // console.log("what #2", row.icsID[propertyName]);
    //     const propValue = `row.Documents.${row.VerNum}`;

    //     // Query to find the document in item_document collection where DocumentID matches DocTitle
    //     const itemDocumentQuery = query(docuCollection, where('DocumentID', '==', propValue));
        
    //     // Execute the query
    //     const itemDocumentQuerySnapshot = await getDocs(itemDocumentQuery);
        
    //     // Check if the document exists
    //     if (!itemDocumentQuerySnapshot.empty) {
    //         // Access the first document (assuming there's only one matching document)
    //         const itemDocumentData = itemDocumentQuerySnapshot.docs[0].data();
        
    //         // Access the 'Link' field
    //         const link = itemDocumentData.Link;
        
    //         // Now you can use the 'link' variable wherever you need
    //         console.log('Link:', link);
    //         return link;
    //     } else {
    //         console.log('none');
    //         return '';
    //     }
    //   },
    //   // renderCell: (params) => (
    //   //   <a href={params.value}>{params.value}</a>
    //   // ),
    // },
  ];

  const filterableColumns = InvCol.filter((column) => column.filterable);
  const [inventoryData, setInventoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchResultsEmpty, setSearchResultsEmpty] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "InvPID",
    direction: "asc",
  });

  const propertyDocRef = doc(db, "property", "YOUR_PROPERTY_ID");

  const propertiesCollection = collection(db, "property");


  const itemDocRef = doc(db, "item_document", "YOUR_DOCU_ID");

  const docuCollection = collection(db, "item_document");

  useEffect(() => {
    onSnapshot(propertiesCollection, (snapshot) => {
      const prefetched = JSON.parse(sessionStorage.getItem("prefetched"));

      let invData = [];
      snapshot.docs.forEach((doc) => {
        let row = doc.data();
        console.log("YAPPAPAP",row)
        commonCollections.forEach(({ name, columnNameOfID }) => {
          let id = row[columnNameOfID];
          // const id = 1;

          console.log("COLNAME", columnNameOfID, "IDDD",id, "NAME", name)

          if (columnNameOfID != "DocumentID"){
            let newAttr = columnNameOfID.slice(0, -2) + "Name";
            console.log("NEW", newAttr)
  
            let replacementName = String(prefetched[name][id]);
            // let replacementName = ""; // Default to empty string
            // if (prefetched[name][id]) {
            //   replacementName = prefetched[name][id]; // If value exists, use it
            // }
            console.log("ID:", id);
            console.log("New Attribute:", newAttr);
            console.log("Replacement Name:", replacementName);
            row = { ...row, [newAttr]: replacementName };

          }

          else {
            console.log("VERNUM:", row.VerNum)
            id = row.Documents[row.VerNum];
            console.log("NEW ID FOR ITEMDOC:", id)
            const docTitle = row.Documents[row.VerNum];
            console.log("GUMAGANA KA BA:", docTitle, "Anuna", name)
  
            const docLink = String(prefetched[name][id]);
            console.log("ANO TO:", docLink)

            let newAttr = columnNameOfID.slice(0, -2) + "Link";
            console.log("New Attribute:", newAttr);

            row = { ...row, [newAttr]: docLink };
          }



          // const docLinkfromitemdoc = docuCollection.find(row.DocTitle === docFromCollectionA)
          // console.log("ANO BA TO:", docLinkfromitemdoc)




        });



        if (row.isArchived !== 1 && row.isApproved !== 0) {
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
    const direction = columnKey === sortConfig.key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key: columnKey, direction });
    const sortedResults = [...filteredData].sort((a, b) => {
      const aValue = a[columnKey];
      const bValue = b[columnKey];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
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

// function DataTable({ data, columns, onSort, sortedField }) {
//   // For Layout
//   const tableStyle = {
//     width: "100%",
//     borderCollapse: "collapse",
//     margin: "20px 0",
//     background: "white",
//   };

//   const tdStyle = {
//     border: "1px solid #ddd",
//     padding: "8px",
//     textAlign: "left",
//   };

//   const renderHeader = (column) => (
//     <th
//       key={column.key}
//       onClick={() => onSort(column.key)}
//       style={{
//         padding: "8px",
//         cursor: "pointer",
//         borderBottom: "2px solid #ccc",
//         backgroundColor: sortedField === column.key ? "#f2f2f2" : "transparent",
//         position: "relative",
//       }}
//     >
//       {column.label}
//       {sortedField === column.key && (
//         <span
//           style={{
//             position: "absolute",
//             top: "50%",
//             right: "8px",
//             transform: "translateY(-50%)",
//           }}
//         >
//           {sortedField === column.key ? "↑" : "↓"}
//         </span>
//       )}
//     </th>
//   );

//   return (
//     <div>
//       <table style={tableStyle}>
//         <thead>
//           <tr>{columns.map((column) => renderHeader(column))}</tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={index}>
//               {columns.map((column) => (
//                 <td key={column.key} style={tdStyle}>
//                   {/* check if the column key is DocumentID */}
//                   {column.key === "DocumentID" &&
//                   typeof item[column.key] === "object"
//                     ? // render the value using TrusteeID from the same row as the key for DocumentID object
//                       item[column.key][item["TrusteeID"]]
//                     : item[column.key]}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// const InventoryColumns = [
//   { key: "PropertyID", label: "Property ID", filterable: true },
//   { key: "PropertyName", label: "Name", filterable: true },
//   { key: "CategoryName", label: "Category", filterable: true },
//   { key: "StatusName", label: "Status", filterable: true },
//   {
//     key: "TrusteeID",
//     label: "Trustee ID",
//     filterable: true,
//   },
//   { key: "LocationName", label: "Location", filterable: true },
//   { key: "PurchaseOrderID", label: "Purchase Order", filterable: true },
//   { key: "SupplierID", label: "Supplier", filterable: true },
//   { key: "Address", label: "Address", filterable: true },
//   { key: "DocumentID", label: "Document", filterable: true },
//   { key: "InvDate", label: "Date Issued", filterable: true },
// ];
