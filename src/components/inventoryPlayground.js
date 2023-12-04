import React, { useEffect, useState } from "react";
import { Link } from "gatsby";


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

const InventoryPlaygroundPage = () => {
  const itemCategoryColumns = [
    { key: 'CategoryID', label: 'ID' },
    { key: 'CategoryName', label: 'Name' },
    { key: 'Category_Desc', label: 'Description' },
  ];

  const PropertyColumns = [
    { key: 'PropertyID', label: 'PropertyID' },
    { key: 'PropertyName', label: 'PropertyName' },
    { key: 'StatusID', label: 'StatusID' },
    { key: 'PropertySupervisorID', label: 'PropertySupervisorID' },
    { key: 'SupplierID', label: 'SupplierID' },
    { key: 'LocationID', label: 'LocationID' },
    { key: 'CategoryID', label: 'CategoryID' },
    { key: 'DocumentID', label: 'DocumentID' },
    { key: 'ArchiveStatus', label: 'ArchiveStatus' },
  ];


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

  const [itemCategoryData, setItemCategoryData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);



  useEffect(() => {
    const fetchItemCategoryData = async () => {
      try {
        const response = await fetch('http://localhost:3000/item_category');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setItemCategoryData(result.data || []);
      } catch (error) {
        console.error('Error fetching item category data:', error.message);
      }
    };

    const fetchPropertyData = async () => {
      try {
        const response = await fetch('http://localhost:3000/property');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setPropertyData(result.data || []);
      } catch (error) {
        console.error('Error fetching property data:', error.message);
      }
    };

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

    // Fetch data for both item category and property
    fetchItemCategoryData();
    fetchPropertyData();
    fetchInventoryData();
  }, []); // Empty dependency array ensures the effect runs only once on component mount





  // const [searchTerm, setSearchTerm] = useState('');

  // const handleSearch = async (value) => {
  //   try {
  //     const response = await fetch(`http://localhost:3000/combo/123?searchTerm=${encodeURIComponent(searchTerm)}`);
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }
  //     const result = await response.json();
  //     setCombinedData(result.data || []);
  //   } catch (error) {
  //     console.error('Error fetching combined data:', error.message);
  //   }
  // };






  return (
    <main>
      <Link to="/">Back to Home</Link>
      <br />
      <Link to="/inventory">Inventory</Link>
      {/* <div>
        <DataTable
          data={itemCategoryData}
          columns={itemCategoryColumns}
          caption="ItemCategory Information"
        />
      </div>
      <div>
        <DataTable
          data={propertyData}
          columns={PropertyColumns}
          caption="Property Information"
        />
      </div> */}
       {/* <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div> */}
      <div>
        <DataTable
          data={inventoryData}
          columns={InventoryColumns}
          caption="Records"
        />
      </div>
    </main>
  );
};

export default InventoryPlaygroundPage;




// function DataTable({ apiEndpoint, columns, caption }) {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("http://localhost:3000/item_category");
//         const result = await response.json();
//         setData(result);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [apiEndpoint]);

//   return (
//     <div>
//       <h1>{caption}</h1>
//       <table>
//         <caption>{caption}</caption>
//         <thead>
//           <tr>
//             {columns.map((column) => (
//               <th key={column.key}>{column.label}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={index}>
//               {columns.map((column) => (
//                 <td key={column.key}>{item[column.key]}</td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// const InventoryPlaygroundPage = () => {
//   const itemCategoryColumns = [
//     { key: "CategoryID", label: "BITCH SID" },
//     { key: "CategoryName", label: "Name" },
//     { key: "Description", label: "Description" },
//   ];

//   return (
//     <main>
//       <Link to="/">Back to Home</Link>
//       <br />
//       <Link to="/inventory">Inventory</Link>
//       <div>
//         {/* Assuming your Express API is running at http://localhost:3001 and has an endpoint like /api/items */}
//         <DataTable
//           apiEndpoint="http://localhost:3000/item_category"
//           columns={itemCategoryColumns}
//           caption="ItemCategory Information"
//         />
//       </div>
//     </main>
//   );
// };

// export default InventoryPlaygroundPage;
