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

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/item_category');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result.data || []); // Assuming the data is nested under the 'data' property
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  return (
    <main>
      <Link to="/">Back to Home</Link>
      <br />
      <Link to="/inventory">Inventory</Link>
      <div>
        <DataTable
          data={data}
          columns={itemCategoryColumns}
          caption="ItemCategory Information"
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
