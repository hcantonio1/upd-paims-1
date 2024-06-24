import React, { useEffect, useState } from "react";
import Layout from "../common/layout";
import { Box, Button, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { FormRow, FormSubheadered, PaimsForm } from "../paimsform/PaimsForm.js";
import { AggregatedFormSelect } from "../paimsform/formSelect.js";
import { fetchCategories, fetchDeptLocations, fetchDeptUsers, fetchStatuses } from "../../fetchutils/fetchdropdowndata.js";
import FormDatePicker from "../paimsform/formDatePicker.js";

import { generatePdf } from "./generatePdf.js";
import { db } from "../../../firebase-config";
import { Timestamp, getDocs, collection, query, where } from "firebase/firestore";

const ReportPage = () => {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [selectionData, setSelectionData] = useState({ TrusteeIDs: [], CategoryIDs: [], LocationIDs: [], StatusIDs: [] });
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [includesArchived, setIncludesArchived] = useState(false);

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
    const selectionDataKey = `${key}s`;
    newSelectionData[selectionDataKey] = e.target.value;
    console.log(newSelectionData, dateRange, includesArchived);
    setSelectionData(newSelectionData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const propRef = collection(db, "property");
      let firestoreQuery = query(propRef);
      const itemDocRef = collection(db, "item_document");
      let firestoreQuery1 = query(itemDocRef);
      console.log("Start!");

      // Construct dynamic where clauses based on selectionData
      if (selectionData.TrusteeIDs.length > 0) {
        firestoreQuery = query(firestoreQuery, where("TrusteeID", "in", selectionData.TrusteeIDs));
        console.log("Trustees selected!");
      }
      if (selectionData.StatusIDs.length > 0) {
        firestoreQuery = query(firestoreQuery, where("StatusID", "in", selectionData.StatusIDs));
        console.log("Statuses selected!");
      }
      if (selectionData.CategoryIDs.length > 0) {
        firestoreQuery = query(firestoreQuery, where("CategoryID", "in", selectionData.CategoryIDs));
        console.log("Categories selected!");
      }
      if (selectionData.LocationIDs.length > 0) {
        firestoreQuery = query(firestoreQuery, where("LocationID", "in", selectionData.LocationIDs));
        console.log("Locations selected!");
      }
      if (dateRange.startDate) {
        firestoreQuery1 = query(firestoreQuery1, where("DateIssued", ">=", Timestamp.fromDate(new Date(dateRange.startDate))));
        console.log("Start date selected!");
      }
      if (dateRange.endDate) {
        firestoreQuery1 = query(firestoreQuery1, where("DateIssued", "<=", Timestamp.fromDate(new Date(dateRange.endDate))));
        console.log("End date selected!");
      }
      if (includesArchived !== true) {
        firestoreQuery = query(firestoreQuery, where("isArchived", "==", 0));
        console.log("Selected unarchived!");
      }
      console.log("Done forming queries!");

      // Execute queries
      const propSnapshot = await getDocs(firestoreQuery);
      const itemDocSnapshot = await getDocs(firestoreQuery1);
      const docIDs = itemDocSnapshot.docs.map((doc) => doc.id);
      const finalProps = propSnapshot.docs
        .filter((prop) => {
          const documentId = prop.data().Documents[prop.data().VerNum];
          return docIDs.some((docId) => docId === documentId);
        })
        .map((prop) => prop.data());

      // generate pdf
      const dateGenerated = new Date();
      const departmentText = "College of Engineering - Department of Computer Science (CEN-DCS)";
      const selectedCategories = categories.filter((cat) => {
        return selectionData.CategoryIDs.includes(cat.CategoryID);
      });
      // console.log(categories[0].CategoryID);
      // console.log(selectionData.CategoryIDs, selectedCategories);
      generatePdf({
        date: dateGenerated,
        categories: selectedCategories,
        department: departmentText,
        properties: finalProps,
      });
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report.");
    }
    console.log("Ended!");
  };

  return (
    <Layout pageTitle="REPORT GENERATION">
      {/* report gen content container  */}
      <Box sx={{ display: "flex", flexDirection: "column", p: 2, margin: 1 }}>
        <PaimsForm header="Generate a Document" onSubmit={handleSubmit}>
          <FormRow segments={4}>
            <Button type="submit" variant="contained" color="success">
              Generate Report
            </Button>
          </FormRow>
          <Typography variant="h9">Generate a summary of all the properties under a select entity.</Typography>
          <Typography variant="h9">Leave out the advanced options empty to generate a report for the entire department.</Typography>
          <br />
          <FormSubheadered subheader={"Advanced Options"}>
            {/* <FormRow segments={4}> */}
            <AggregatedFormSelect multiple id={`TrusteeID`} label="Trustee" value={selectionData.TrusteeIDs} onChange={handleInputChange} options={users} />
            <AggregatedFormSelect multiple id={`CategoryID`} label="Category" value={selectionData.CategoryIDs} onChange={handleInputChange} options={categories} />
            <AggregatedFormSelect multiple id={`StatusID`} label="Status" value={selectionData.StatusIDs} onChange={handleInputChange} options={statuses} />
            <AggregatedFormSelect multiple id={`LocationID`} label="Location" value={selectionData.LocationIDs} onChange={handleInputChange} options={locations} />
            {/* </FormRow> */}
          </FormSubheadered>
          <FormSubheadered subheader="Specify a Date Range">
            <FormRow segments={3}>
              <FormDatePicker id="startDate" label="Start Date" value={dateRange.startDate} onChange={(val) => setDateRange({ ...dateRange, startDate: val })} />
              <FormDatePicker id="endDate" label="End Date" value={dateRange.endDate} onChange={(val) => setDateRange({ ...dateRange, endDate: val })} />
            </FormRow>
          </FormSubheadered>
          <FormSubheadered subheader="Include Archived Properties">
            <FormControlLabel
              value={includesArchived}
              control={<Checkbox />}
              id="includesArchived"
              label="Include archived properties in the report."
              labelPlacement="end"
              onChange={(e, val) => {
                setIncludesArchived(val);
              }}
            />
          </FormSubheadered>
        </PaimsForm>
      </Box>
    </Layout>
  );
};

export default ReportPage;
