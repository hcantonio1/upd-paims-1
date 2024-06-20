import React, { useEffect, useState } from "react";
import Layout from "../common/layout";
import { Box, Button, Typography } from "@mui/material";
import { FormRow, FormSubheadered, PaimsForm } from "../paimsform/paimsForm.js";
import { AggregatedFormSelect } from "../paimsform/formSelect.js";
import { fetchCategories, fetchDeptLocations, fetchDeptUsers, fetchStatuses } from "../../fetchutils/fetchdropdowndata.js";
import FormDatePicker from "../paimsform/formDatePicker.js";

import { generateReport } from "./generatereport.js";
import ReportGeneration from "./reportGeneration";

const ReportPage = () => {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [selectionData, setSelectionData] = useState({ trustees: [], categories: [], locations: [], statuses: [] });
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

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
    const newSelectionData = { ...selectionData };
    const key = e.target.name !== "" ? e.target.name : e.target.id;
    const selectionDataKey = key === "TrusteeID" ? "trustees" : key === "CategoryID" ? "categories" : key === "StatusID" ? "statuses" : key === "LocationID" ? "locations" : null;
    newSelectionData[selectionDataKey] = e.target.value;
    // console.log(newSelectionData);
    setSelectionData(newSelectionData);
  };

  return (
    <Layout pageTitle="REPORT GENERATION">
      {/* report gen content container  */}
      <Box sx={{ display: "flex", flexDirection: "column", p: 2, margin: 1 }}>
        <PaimsForm header="Generate a Document">
          <FormRow segments={4}>
            <Button variant="contained" color="success" onClick={generateReport}>
              Generate Report
            </Button>
          </FormRow>
          <Typography variant="h6">Generate a summary of all the properties under a select entity.</Typography>
          <Typography variant="h6">Leave out the advanced options empty to generate a report for the entire department.</Typography>
          <br />
          <FormSubheadered subheader={"Advanced Options"}>
            {/* <FormRow segments={4}> */}
            <AggregatedFormSelect multiple id={`TrusteeID`} label="Trustee" value={selectionData.trustees} onChange={handleInputChange} options={users} />
            <AggregatedFormSelect multiple id={`CategoryID`} label="Category" value={selectionData.categories} onChange={handleInputChange} options={categories} />
            <AggregatedFormSelect multiple id={`StatusID`} label="Status" value={selectionData.statuses} onChange={handleInputChange} options={statuses} />
            <AggregatedFormSelect multiple id={`LocationID`} label="Location" value={selectionData.locations} onChange={handleInputChange} options={locations} />
            {/* </FormRow> */}
          </FormSubheadered>
          <FormSubheadered subheader="Specify a Date Range">
            <FormRow segments={3}>
              <FormDatePicker id="startDate" label="Start Date" value={dateRange.startDate} onChange={(val) => setDateRange({ ...dateRange, startDate: val })} />
              <FormDatePicker id="endDate" label="End Date" value={dateRange.endDate} onChange={(val) => setDateRange({ ...dateRange, endDate: val })} />
            </FormRow>
          </FormSubheadered>
        </PaimsForm>
      </Box>
    </Layout>
  );
};

export default ReportPage;
