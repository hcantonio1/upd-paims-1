import React, { useState, useEffect } from "react";
import Layout from "../common/layout";
import { Box, Typography, Paper } from "@mui/material";
import { PaimsForm, FormSubheadered, FormRow, SubmitButton } from "../paimsform/paimsForm";
import SmallTextField from "../paimsform/smallTextField";
import { AggregatedFormSelect } from "../paimsform/formSelect";
import FormDatePicker from "../paimsform/formDatePicker";
import { FormFileUpload } from "../paimsform/formFileUpload";
import PropertyRow, { AddPropRowButton, DeletePropRowButton, NextPropRowButton, PrevPropRowButton } from "./propertyRow";

import { fetchDeptUsers, fetchCategories, fetchStatuses, fetchDeptLocations, fetchTypes } from "../../fetchutils/fetchdropdowndata";
import { fetchDocumentAutofill, fetchSupplierAutofill } from "../../fetchutils/formautofill";
import dayjs from "dayjs";
import { insertDocument, handleSubmit } from "./handleinsert";

const PROPERTY_ROW_FIELDS = {
  CategoryID: "",
  LocationID: "",
  PropertyID: "",
  PropertyName: "",
  TrusteeID: "",
  StatusID: "",
  SupplierID: "",
  PurchaseDate: null,
  PurchaseOrderID: "",
  TotalCost: "",
  City: "",
  State: "",
  StreetName: "",
  SupplierContact: "",
  SupplierName: "",
  UnitNumber: "",
};

const InsertRecord = () => {
  const [docData, setDocData] = useState({ DocumentID: "", DocumentType: "", DateIssued: null, IssuedBy: "", ReceivedBy: "", Link: "", holdLink: "" });

  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);
  const [docLocked, setDocLocked] = useState(false);

  const [propertyRows, setPropertyRows] = useState([{ ...PROPERTY_ROW_FIELDS }]);
  const [propRowToDisplay, setPropRowToDisplay] = useState(0);
  const [propRowLocks, setPropRowLocks] = useState([{ orderLocked: false, supLocked: false }]);

  const addPropertyRow = () => {
    const propRowData = { ...PROPERTY_ROW_FIELDS };
    setPropertyRows([...propertyRows, propRowData]);
    setPropRowLocks([...propRowLocks, { orderLocked: false, supLocked: false }]);
  };

  useEffect(() => {
    const fetchdropdowndata = async () => {
      setUsers(await fetchDeptUsers());
      setCategories(await fetchCategories());
      setLocations(await fetchDeptLocations());
      setStatuses(await fetchStatuses());
      setTypes(await fetchTypes());
    };
    fetchdropdowndata();
  }, []);

  useEffect(() => {
    const autofillDocumentData = async () => {
      const documentAutofillData = await fetchDocumentAutofill(docData.DocumentID);
      if (!!documentAutofillData) {
        setDocLocked(true);
        setDocData((prev) => {
          delete documentAutofillData.DocumentID;
          const docData = { ...documentAutofillData, DateIssued: dayjs(documentAutofillData.DateIssued.toDate()) };
          const oldDocData = { ...prev };
          const newDocData = Object.assign(oldDocData, docData);
          return newDocData;
        });
        return;
      }
      setDocLocked(false);
    };
    if (docData.DocumentID) {
      autofillDocumentData();
    }
  }, [docData.DocumentID]);

  const currPropRowSupplier = propertyRows[propRowToDisplay].SupplierID;
  useEffect(() => {
    const autofillSupplierData = async () => {
      const supplierAutofillData = await fetchSupplierAutofill(currPropRowSupplier);
      if (!!supplierAutofillData) {
        // setDocLocked(true);
        const supData = supplierAutofillData;
        setPropertyRows((prev) => {
          const newPropertyRows = [...prev];
          const myRow = newPropertyRows[propRowToDisplay];
          const myNewRow = {
            ...myRow,
            [`City`]: supData.City,
            [`State`]: supData.State,
            [`StreetName`]: supData.StreetName,
            [`SupplierContact`]: supData.SupplierContact,
            [`SupplierName`]: supData.SupplierName,
            [`UnitNumber`]: parseInt(supData.UnitNumber),
          };
          newPropertyRows[propRowToDisplay] = myNewRow;
          return newPropertyRows;
        });
        return;
      }
      // setDocLocked(false);
    };
    if (currPropRowSupplier) {
      autofillSupplierData();
    }
  }, [currPropRowSupplier, propRowToDisplay]);

  const handleDocChange = (e) => {
    // MUI Select sends an object target={name, value} as opposed to regular onChange which sends a target=HTML
    const docDataKey = e.target.name !== "" ? e.target.name : e.target.id;
    setDocData({ ...docData, [docDataKey]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setDocData({ ...docData, holdLink: file });
    console.log(file);
  };

  const handlePropRowChange = (e, index) => {
    // MUI Select sends an object target={name, value} as opposed to regular onChange which sends a target=HTML
    const newPropertyRows = [...propertyRows];
    const propRowKey = e.target.name !== "" ? e.target.name : e.target.id;
    newPropertyRows[index][propRowKey] = e.target.value;
    setPropertyRows(newPropertyRows);
  };

  const addPropRowButtonFunc = (e) => {
    addPropertyRow();
    setPropRowToDisplay(propRowToDisplay + 1);
  };

  const nextPropRowButtonFunc = (e) => setPropRowToDisplay(Math.min(propertyRows.length - 1, propRowToDisplay + 1));

  const prevPropRowButtonFunc = (e) => setPropRowToDisplay(Math.max(0, propRowToDisplay - 1));

  const delPropRowButtonFunc = (e) => {
    const newPropertyRows = [...propertyRows];
    newPropertyRows.splice(propRowToDisplay, 1);
    const newPropRowLocks = [...propRowLocks];
    newPropRowLocks.splice(propRowToDisplay, 1);
    setPropertyRows(newPropertyRows);
    setPropRowLocks(newPropRowLocks);
    setPropRowToDisplay(Math.min(propertyRows.length - 1, propRowToDisplay));
  };

  const docSubheadered = (
    <FormSubheadered subheader="Document Details">
      <FormRow segments={3}>
        <SmallTextField id="DocumentID" label="Document Name" value={docData.DocumentID} onChange={handleDocChange} required />
        <AggregatedFormSelect label="Type" id="DocumentType" value={docData.DocumentType} onChange={handleDocChange} options={types} readOnly={docLocked} required />
        <FormDatePicker
          id="DateIssued"
          label="Date Issued"
          value={docData.DateIssued}
          onChange={(val) =>
            setDocData({
              ...docData,
              DateIssued: val,
            })
          }
          readOnly={docLocked}
        />
      </FormRow>
      <FormRow segments={3}>
        <AggregatedFormSelect label="IssuedBy" id="IssuedBy" value={docData.IssuedBy} onChange={handleDocChange} disabled={docLocked} options={users} />
        <AggregatedFormSelect label="ReceivedBy" id="ReceivedBy" value={docData.ReceivedBy} onChange={handleDocChange} disabled={docLocked} options={users} />
        <FormFileUpload id="Link" filename={docData.holdLink?.name} onChange={handleFileChange} disabled={docLocked} />
      </FormRow>
    </FormSubheadered>
  );

  return (
    <Layout pageTitle="INSERT">
      <Box sx={{ padding: 2, margin: 1 }}>
        <main>
          <PaimsForm header="Encode a Document into the Database" onSubmit={(e) => handleSubmit(e, docData, propertyRows)}>
            {docSubheadered}
            <SubmitButton text="Only Submit Document Info" onClick={(e) => insertDocument(e, docData)} disabled={docLocked} />
            <Paper sx={{ p: 2, backgroundColor: "#f3f3f3" }}>
              <Box display="flex" flexDirection="row" height={36}>
                <Typography width="50%" variant="h9" fontWeight={"bold"}>
                  Property {propRowToDisplay + 1}
                </Typography>
                <Box width="50%" display="flex" flexDirection="row" justifyContent="end">
                  <DeletePropRowButton onClick={delPropRowButtonFunc} disabled={propertyRows.length <= 1} />
                </Box>
              </Box>
              <PropertyRow
                propRowData={propertyRows[propRowToDisplay]}
                locks={propRowLocks[propRowToDisplay]}
                handleChange={(e) => handlePropRowChange(e, propRowToDisplay)}
                dropdowndata={{ users, statuses, categories, locations, types }}
                podatepickerfunc={(val) => {
                  const newPropertyRows = [...propertyRows];
                  newPropertyRows[propRowToDisplay][`PurchaseDate`] = val;
                  setPropertyRows(newPropertyRows);
                }}
              />
              <Box display="flex" flexDirection="row" justifyContent="end">
                <PrevPropRowButton onClick={prevPropRowButtonFunc} />
                {propertyRows.length - 1 === propRowToDisplay ? <AddPropRowButton onClick={addPropRowButtonFunc} /> : <NextPropRowButton onClick={nextPropRowButtonFunc} />}
              </Box>
            </Paper>
            <SubmitButton text="Insert All Properties" />
          </PaimsForm>
        </main>
      </Box>
    </Layout>
  );
};

export const Head = () => <title>Insert Record</title>;

export default InsertRecord;
