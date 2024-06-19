import React, { useEffect, useState } from "react";
import Layout from "../common/layout";
import { getUser } from "../../services/auth";
import { Box, Checkbox, Typography } from "@mui/material";
import { FormRow, FormSubheadered, PaimsForm } from "../paimsform/paimsForm.js";
import { AggregatedFormSelect } from "../paimsform/formSelect.js";
import { fetchCategories, fetchDeptLocations, fetchDeptUsers, fetchStatuses } from "../../fetchutils/fetchdropdowndata.js";

const ReportPage = () => {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [formData, setFormData] = useState({ trustees: [], categories: [], locations: [], statuses: [] });

  useEffect(() => {
    const fetchdropdowndata = async () => {
      setUsers(await fetchDeptUsers());
      setCategories(await fetchCategories());
      setLocations(await fetchDeptLocations());
      setStatuses(await fetchStatuses());
    };
    fetchdropdowndata();
  }, []);

  const handleInputChange = (e) => {
    // MUI Select sends an object target={name, value} as opposed to regular onChange which sends a target=HTML
    const newFormData = { ...formData };
    const key = e.target.name !== "" ? e.target.name : e.target.id;
    const formDataKey = key === "TrusteeID" ? "trustees" : key === "CategoryID" ? "categories" : key === "StatusID" ? "statuses" : key === "LocationID" ? "locations" : null;
    newFormData[formDataKey] = e.target.value;
    // console.log(newFormData);
    setFormData(newFormData);
  };

  return (
    <Layout pageTitle="REPORT GENERATION">
      {/* report gen content container  */}
      <Box sx={{ display: "flex", flexDirection: "column", p: 2, margin: 1 }}>
        <PaimsForm header="Generate a Document">
          {/* hello user  */}
          <FormSubheadered subheader={""}>
            <Typography variant="h6">Generate a summary of all the properties under a select entity</Typography>
            {/* <FormRow segments={4}> */}
            <AggregatedFormSelect multiple id={`TrusteeID`} label="Trustee" value={formData.trustees} onChange={handleInputChange} options={users} />
            <AggregatedFormSelect multiple id={`CategoryID`} label="Category" value={formData.categories} onChange={handleInputChange} options={categories} />
            <AggregatedFormSelect multiple id={`StatusID`} label="Status" value={formData.statuses} onChange={handleInputChange} options={statuses} />
            <AggregatedFormSelect multiple id={`LocationID`} label="Location" value={formData.locations} onChange={handleInputChange} options={locations} />
            {/* </FormRow> */}
          </FormSubheadered>
        </PaimsForm>
      </Box>
    </Layout>
  );
};

export default ReportPage;
