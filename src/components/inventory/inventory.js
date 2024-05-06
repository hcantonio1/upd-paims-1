import React, { useEffect, useState } from "react";
import Layout from "../common/layout.js";
import { doc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase-config.js";
import { commonCollections } from "../../services/prefetch.js";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Link } from '@mui/material';


const InventoryPage = () => {
  const InvCol = [
    { field: "PropertyID", headerName: "ID", width: 50 },
    { field: "PropertyName", headerName: "Name", width: 150 },
    { field: "CategoryName", headerName: "Category", width: 100 },
    { field: "StatusName", headerName: "Status", width: 100 },
    { field: "TrusteeName", headerName: "Trustee", width: 120 },
    { field: "LocationName", headerName: "Location", width: 130 },
    { field: "PurchaseOrderID", headerName: "Purchase Order", width: 80 },
    { field: "SupplierName", headerName: "Supplier", width: 170 },
    { field: "DocumentLink", headerName: "Document", width: 100,
      renderCell: rowData =>
        <Link href={`${rowData.row.DocumentLink}`} target="_blank">
          { // console.log("HEYHOTHISISWHAT", rowData.row.DocumentLink)
          rowData.row.Documents[rowData.row.VerNum]
          }
        </Link>
    },
    { field: "VerNum", headerName: "Version", width: 50 },
  ];

  const [inventoryData, setInventoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

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

          if (columnNameOfID == "DocumentID"){
            id = row.Documents[row.VerNum];
            const docTitle = row.Documents[row.VerNum];
            // console.log("GUMAGANA KA BA:", docTitle, "Anuna", name)
            const docLink = String(prefetched[name][id]);
            // console.log("ANO TO:", docLink)
            let newAttr = columnNameOfID.slice(0, -2) + "Link";
            row = { ...row, [newAttr]: docLink };
          }

          else if (columnNameOfID == "UserID"){
            id = row.TrusteeID;
            const userName = String(prefetched[name][id]);
            // console.log("ANO TO USER:", userName)
            let newAttr = "TrusteeName";
            row = { ...row, [newAttr]: userName };
          }

          else {
            let newAttr = columnNameOfID.slice(0, -2) + "Name";
            console.log("NEW", newAttr)
            let replacementName = String(prefetched[name][id]);
            row = { ...row, [newAttr]: replacementName };
          }
        });

        if (row.isArchived !== 1 && row.isApproved !== 0) {
          invData.push(row);
        }
      });
      setInventoryData(invData);
    });
  }, []);


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

