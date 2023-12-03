import React, { useEffect, useState } from "react";
import { Link } from "gatsby";
import Layout from "./layout";
import * as styles from "../styles/index.module.css";

const HomePage = () => {
  const [propertyData, setPropertyData] = useState([]);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await fetch("http://localhost:3000/property");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setPropertyData(result.data || []);
      } catch (error) {
        console.error("Error fetching property data:", error.message);
      }
    };

    // Fetch data for both item category and property
    fetchPropertyData();
  }, []);

  return (
    <Layout pageTitle="DASHBOARD">
      <main>
        <div>
          <p>Hello User!</p>
        </div>
        <div>
          <p>Here's the summary of the properties in your custody.</p>
        </div>
        <div>
          <DataTable
            data={propertyData}
            columns={PropertyColumns}
            caption="Property Information"
          />
        </div>
      </main>
    </Layout>
  );
};

export default HomePage;

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

const PropertyColumns = [
  { key: "PropertyID", label: "PropertyID" },
  { key: "PropertyName", label: "PropertyName" },
  { key: "StatusID", label: "StatusID" },
  { key: "PropertySupervisorID", label: "PropertySupervisorID" },
  { key: "SupplierID", label: "SupplierID" },
  { key: "LocationID", label: "LocationID" },
  { key: "CategoryID", label: "CategoryID" },
  { key: "DocumentID", label: "DocumentID" },
  { key: "ArchiveStatus", label: "ArchiveStatus" },
];
