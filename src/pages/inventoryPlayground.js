import React, { useEffect, useState } from "react";
import { Link } from "gatsby";

function DataTable({ apiEndpoint, columns, caption }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiEndpoint);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiEndpoint]);

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

const IndexPage = () => {
  const itemCategoryColumns = [
    { key: "CategoryID", label: "BITCH SID" },
    { key: "CategoryName", label: "Name" },
    { key: "Description", label: "Description" },
  ];

  return (
    <main>
      <Link to="/">Back to Home</Link>
      <br />
      <Link to="/inventory">Inventory</Link>
      <div>
        {/* Assuming your Express API is running at http://localhost:3001 and has an endpoint like /api/items */}
        <DataTable
          apiEndpoint="http://localhost:3000"
          columns={itemCategoryColumns}
          caption="ItemCategory Information"
        />
      </div>
    </main>
  );
};

export default IndexPage;
