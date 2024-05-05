import React, { useEffect, useState } from "react";
import Layout from "../common/layout.js";
import SearchBar from "../common/searchbar.js";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../firebase-config.js";
import { commonCollections } from "../../services/prefetch.js";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import "firebase/database";
import { doc, getDoc } from "firebase/firestore";
import Link from '@mui/material/Link';




const InventoryPage = () => {
  const InvCol = [
    { field: "PropertyID", headerName: "ID", width: 30 },
    { field: "PropertyName", headerName: "Name", width: 150 },
    { field: "CategoryName", headerName: "Category", width: 100 },
    { field: "StatusName", headerName: "Status", width: 100 },
    { field: "TrusteeName", headerName: "Trustee", width: 120 },
    { field: "LocationName", headerName: "Location", width: 130 },
    { field: "PurchaseOrderID", headerName: "Purchase Order", width: 80 },
    { field: "SupplierName", headerName: "Supplier", width: 170 },
    {
      field: "DocumentLink", headerName: "Document", width: 100,
      renderCell: rowData =>
        <Link href={`${rowData.row.DocumentLink}`} target="_blank">
          {
          // console.log("HEYHOTHISISWHAT", rowData.row.DocumentLink)
          rowData.row.Documents[rowData.row.VerNum]
          }
        </Link>
    },
    { field: "VerNum", headerName: "Version", width: 50 },
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

  useEffect(() => {
    onSnapshot(propertiesCollection, (snapshot) => {
      const prefetched = JSON.parse(sessionStorage.getItem("prefetched"));

      let invData = [];
      snapshot.docs.forEach((doc) => {
        let row = doc.data();
        // console.log("YAPPAPAP",row)
        commonCollections.forEach(({ name, columnNameOfID }) => {
          let id = row[columnNameOfID];
          // console.log("COLNAME", columnNameOfID, "IDDD",id, "NAME", name)

          if (columnNameOfID == "DocumentID"){
            // console.log("VERNUM:", row.VerNum)
            id = row.Documents[row.VerNum];
            // console.log("NEW ID FOR ITEMDOC:", id)
            const docTitle = row.Documents[row.VerNum];
            // console.log("GUMAGANA KA BA:", docTitle, "Anuna", name)
            const docLink = String(prefetched[name][id]);
            // console.log("ANO TO:", docLink)
            let newAttr = columnNameOfID.slice(0, -2) + "Link";
            // console.log("New Attribute:", newAttr);
            row = { ...row, [newAttr]: docLink };
          }

          else if (columnNameOfID == "UserID"){
            id = row.TrusteeID;
            // console.log("ID FOR Trustee:", id)
            const userName = String(prefetched[name][id]);
            // console.log("ANO TO USER:", userName)
            let newAttr = "TrusteeName";
            row = { ...row, [newAttr]: userName };
          }

          else {
            let newAttr = columnNameOfID.slice(0, -2) + "Name";
            console.log("NEW", newAttr)
            let replacementName = String(prefetched[name][id]);
            // console.log("ID:", id);
            // console.log("New Attribute:", newAttr);
            // console.log("Replacement Name:", replacementName);
            row = { ...row, [newAttr]: replacementName };
          }
        });

        if (row.isArchived !== 1 && row.isApproved !== 0) {
          // Filter out archived and not approved items here
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

  return (
    <Layout pageTitle="INVENTORY">
      <main>
        <div>
            <Box sx={{ height: 400, width: "100%" }}>
              <DataGrid
                getRowId={(row) => row.PropertyID + "_" + row.PurchaseOrderID}
                rows={filteredData.length > 0 ? filteredData : inventoryData}
                columns={InvCol}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                  columns: { columnVisibilityModel: {
                      VerNum: false,
                    },
                  },
                }}
                pageSizeOptions={[10]}
                checkboxSelection
                disableRowSelectionOnClick
                disableColumnResize={true}
                slots={{
                  toolbar: GridToolbar,
                }}
                slotProps={{
                  toolbar: {
                    csvOptions:{allColumns: true},
                    showQuickFilter: true,
                }                
                }}
              />
            </Box>
        </div>
      </main>
    </Layout>
  );
};

export const Head = () => <title>Inventory Page</title>;
export default InventoryPage;

