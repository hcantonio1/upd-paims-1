import React, { useEffect, useState } from "react";
import { Link } from "gatsby";
import Layout from "./layout";
import SearchBar from "./searchbar";


function DataTable({ data, columns, caption }) {
  return (
    <div>
      <h1>{caption}</h1>
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key}>{item[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}




// DEFINE PAGE COMPONENTS

const InventoryPage = ({ data }) => {
  const InventoryColumns = [
    { key: 'InvPID', label: 'Property ID' },
    { key: 'InvPName', label: 'Name' },
    { key: 'InvCName', label: 'Category' },
    { key: 'StatusName', label: 'Status' },
    { key: 'PropertySupervisor', label: 'Property Supervisor' },
    { key: 'Location', label: 'Location' },
    { key: 'InvPOID', label: 'Purchase Order' },
    { key: 'SupplierName', label: 'Supplier' },
    { key: 'Address', label: 'Address' },
    { key: 'InvDID', label: 'Document' },
    { key: 'InvDate', label: 'Date Issued' },
  ];


  // const [data, setData] = useState([]);


  const [inventoryData, setInventoryData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await fetch('http://localhost:3000/combo');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setInventoryData(result.data || []);
      } catch (error) {
        console.error('Error fetching inventory data:', error.message);
      }
    };

    fetchInventoryData();
  }, []);









  

  return (
    <Layout pageTitle="INVENTORY">
      <main>
        <Link to="/app/inventoryPlayground">Playground</Link>
        <div>
        <DataTable
          data={inventoryData}
          columns={InventoryColumns}
          caption="Records"
        />
      </div>
      </main>
    </Layout>
  );
};


// You'll learn about this in the next task, just copy it for now
export const Head = () => <title>Inventory Page</title>;

// Step 3: Export your component
export default InventoryPage;
