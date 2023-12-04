import React, { useEffect, useState } from "react";
import { Link } from "gatsby";
import SearchBar from "./searchbar";
import FilterBy from "./filter";


function DataTable({ data, columns, caption, onSort }) {
  if (data.length === 0) {
    return <p>No results found.</p>;
  }

  return (
    <div>
      <h1>{caption}</h1>
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} onClick={() => onSort(column.key)}>
                {column.label}
              </th>
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
  const InventoryColumns = [
    { key: 'InvPID', label: 'Property ID', filterable: true  },
    { key: 'InvPName', label: 'Name', filterable: true  },
    { key: 'InvCName', label: 'Category', filterable: true  },
    { key: 'StatusName', label: 'Status', filterable: true  },
    { key: 'PropertySupervisor', label: 'Property Supervisor' , filterable: true },
    { key: 'Location', label: 'Location', filterable: true  },
    { key: 'InvPOID', label: 'Purchase Order' , filterable: true },
    { key: 'SupplierName', label: 'Supplier', filterable: true  },
    // { key: 'Address', label: 'Address', filterable: true  },
    { key: 'InvDID', label: 'Document' , filterable: true },
    { key: 'InvDate', label: 'Date Issued' , filterable: true },
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


  const filterableColumns = InventoryColumns.filter((column) => column.filterable);



  const [filteredData, setFilteredData] = useState([]);
  const [searchResultsEmpty, setSearchResultsEmpty] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'InvPID', direction: 'asc' });



  const handleSearch = (searchTerm) => {
    console.log('Search Term:', searchTerm);
    console.log('Selected Filter:', selectedFilter);
  
    // Filter the data based on the search term and selected filter
    const filteredResults = inventoryData.filter((item) => {
      const match = Object.entries(item).some(([key, value]) => {
        console.log('Checking:', key, value);

        if (key === selectedFilter) {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (typeof value === 'number') {
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

  
  const handleSort = (columnKey) => {
    // If the same column is clicked, toggle the sort direction
    const direction = columnKey === sortConfig.key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key: columnKey, direction });

    // Perform sorting based on the selected column and direction
    const sortedResults = [...filteredData].sort((a, b) => {
      const aValue = a[columnKey];
      const bValue = b[columnKey];

      if (direction === 'asc') {
        return aValue - bValue;
      } else if (direction === 'desc') {
        return bValue - aValue;
      }

      return 0;
    });

    setFilteredData(sortedResults);
  };






  return (
    <main>
      <Link to="/">Back to Home</Link>
      <br />
      <Link to="/inventory">Inventory</Link>
      <SearchBar onSearch={handleSearch} />
      <FilterBy options={filterableColumns.map((column) => column.label)} onFilterChange={handleFilterChange} />


      <div>
        {searchResultsEmpty ? (
          <p>No records found.</p>
        ) : (
        <DataTable
          data={filteredData.length > 0 ? filteredData : inventoryData}
          // data={inventoryData}
          columns={InventoryColumns}
          caption="Records"
          onSort={handleSort}
        />
        )}
      </div>
    </main>
  );
};

export default InventoryPlaygroundPage;






// const filteredResults = inventoryData.filter((item) => {
//   const match = Object.entries(item).some(([key, value]) => {
//     console.log('Checking:', key, value);

//     // if (key === selectedFilter) {
//     //   return value.toLowerCase().includes(searchTerm.toLowerCase());
//     // }

//     // const value = item[selectedFilter];

    
//     if (typeof value === 'string') {
//       return value.toLowerCase().includes(searchTerm.toLowerCase());
//     } else if (typeof value === 'number') {
//       return value.toString().includes(searchTerm.toLowerCase());
//     }
//     return false;
//   });

//   return match;
// });



// const handleSearch = (searchTerm) => {
//   // Filter the data based on the search term
//   const filteredResults = inventoryData.filter((item) =>
//     Object.values(item).some((value) => {
//       if (typeof value === 'string') {
//         return value.toLowerCase().includes(searchTerm.toLowerCase());
//       } else if (typeof value === 'number') {
//         return value.toString().includes(searchTerm);
//       }
//       return false;
//     })
//   );

//   setFilteredData(filteredResults);
//   setSearchResultsEmpty(filteredResults.length === 0);

// };






// const itemCategoryColumns = [
//   { key: 'CategoryID', label: 'ID' },
//   { key: 'CategoryName', label: 'Name' },
//   { key: 'Category_Desc', label: 'Description' },
// ];

// const PropertyColumns = [
//   { key: 'PropertyID', label: 'PropertyID' },
//   { key: 'PropertyName', label: 'PropertyName' },
//   { key: 'StatusID', label: 'StatusID' },
//   { key: 'PropertySupervisorID', label: 'PropertySupervisorID' },
//   { key: 'SupplierID', label: 'SupplierID' },
//   { key: 'LocationID', label: 'LocationID' },
//   { key: 'CategoryID', label: 'CategoryID' },
//   { key: 'DocumentID', label: 'DocumentID' },
//   { key: 'ArchiveStatus', label: 'ArchiveStatus' },
// ];


// const [itemCategoryData, setItemCategoryData] = useState([]);
// const [propertyData, setPropertyData] = useState([]);

// useEffect(() => {
//   const fetchItemCategoryData = async () => {
//     try {
//       const response = await fetch('http://localhost:3000/item_category');
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const result = await response.json();
//       setItemCategoryData(result.data || []);
//     } catch (error) {
//       console.error('Error fetching item category data:', error.message);
//     }
//   };

//   const fetchPropertyData = async () => {
//     try {
//       const response = await fetch('http://localhost:3000/property');
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const result = await response.json();
//       setPropertyData(result.data || []);
//     } catch (error) {
//       console.error('Error fetching property data:', error.message);
//     }
//   };

//   const fetchInventoryData = async () => {
//     try {
//       const response = await fetch('http://localhost:3000/combo');
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const result = await response.json();
//       setInventoryData(result.data || []);
//     } catch (error) {
//       console.error('Error fetching inventory data:', error.message);
//     }
//   };

//   // Fetch data for both item category and property
//   fetchItemCategoryData();
//   fetchPropertyData();
//   fetchInventoryData();
// }, []); // Empty dependency array ensures the effect runs only once on component mount















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




//   return (
//     <main>
//       <Link to="/">Back to Home</Link>
//       <br />
//       <Link to="/inventory">Inventory</Link>
//       {/* <div>
//         <DataTable
//           data={itemCategoryData}
//           columns={itemCategoryColumns}
//           caption="ItemCategory Information"
//         />
//       </div>
//       <div>
//         <DataTable
//           data={propertyData}
//           columns={PropertyColumns}
//           caption="Property Information"
//         />
//       </div> */}
//        {/* <div>
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <button onClick={handleSearch}>Search</button>
//       </div> */}
//       <div>
//         <DataTable
//           data={inventoryData}
//           columns={InventoryColumns}
//           caption="Records"
//         />
//       </div>
//     </main>
//   );
// };

// export default InventoryPlaygroundPage;




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
