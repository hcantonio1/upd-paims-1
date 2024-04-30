import * as React from "react";
import { useState, useEffect } from "react";
import { db } from "../../../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import { Close, Add, West, East } from "@mui/icons-material";
import { autoFillDocumentData, autoFillSupplierData } from "./formautofill";
import { fetchDeptUsers, fetchCategories, fetchStatuses, fetchDeptLocations, fetchTypes } from "./fetchdropdowndata";
import { insertDocument, handleSubmit } from "./handleinsert1";

import Layout from "../common/layout";
import { PaimsForm, FormSubheadered, FormRow } from "../paimsform/paimsForm";
import SmallTextField from "../paimsform/smallTextField";
import { AggregatedFormSelect } from "../paimsform/formSelect";
import SubmitButton from "../paimsform/submitButton";
import FormDatePicker from "../paimsform/formDatePicker";
import FormFileUpload from "../paimsform/formFileUpload";

import PropertyRow from "./propertyRow";

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

const getFullName = (user) => {
  return `${user.FirstName} ${user.LastName}`;
};

const getFullLoc = (location) => {
  return `${location.Building} ${location.RoomNumber}`;
};
const InsertRecord = () => {
  const [inputData, setInputData] = useState({
    DocumentID: "",
    DocumentType: "",
    DateIssued: null,
    IssuedBy: "",
    ReceivedBy: "",
    Link: "",
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
  });

  // const [propRowStates, setPropRowStates] = useState([{ ...PROPERTY_ROW_FIELDS }]);
  // const [propRowHandlers, setPropRowHandlers] = useState([]); // ??? how to put handleInputChange here

  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);

  const [docLocked, setDocLocked] = useState(false);
  const [supLocked, setSupLocked] = useState(false);
  const [orderLocked, setOrderLocked] = useState(false);

  const [propertyRows, setPropertyRows] = useState([]);
  const [rowHandlers, setRowHandlers] = useState([]);
  const [propRowToDisplay, setPropRowToDisplay] = useState(0);

  const addPropertyRow = () => {
    const rownum = propertyRows.length;
    const propRowData = {};
    for (const key in PROPERTY_ROW_FIELDS) {
      const newkey = `${key}_${rownum}`;
      propRowData[newkey] = PROPERTY_ROW_FIELDS[key];
    }
    // const dropdownData = { users, statuses, categories, locations, types };

    const rowChangeHandler = (e) => {
      if (e.target.name !== "") {
        // probably a PointerEvent due to MUI Select
        propRowData[e.target.name] = e.target.value;
        setPropertyRows([...propertyRows.slice(0, rownum), propRowData, ...propertyRows.slice(rownum)]);
      } else {
        // regular onChange event
        propRowData[e.target.id] = e.target.value;
        setPropertyRows([...propertyRows.slice(0, rownum), propRowData, ...propertyRows.slice(rownum)]);
      }

      // if (e.target.id === "DocumentID") {
      //   autoFillDocumentData(e.target.value, setDocLocked, setInputData);
      // }
      // if (e.target.id === "SupplierID") {
      //   autoFillSupplierData(e.target.value, setSupLocked, setInputData);
      // }
      // if (e.target.id === "PropertyID") {
      //   fetchPropertyData(e.target.value);
      // }
      //if (e.target.id === `PurchaseOrderID_${index}`) {
      //  fetchOrderData(e.target.value);
      //}
    };

    setPropertyRows([...propertyRows, propRowData]);
    setRowHandlers([...rowHandlers, rowChangeHandler]);
  };

  useEffect(() => {
    const fetchdropdowndata = async () => {
      setUsers(await fetchDeptUsers());
      setCategories(await fetchCategories());
      setLocations(await fetchDeptLocations());
      setStatuses(await fetchStatuses());
      setTypes(await fetchTypes());
    };

    const makeFirstPropertyRow = async () => {
      await fetchdropdowndata();
      // console.log("aaaaaaaa", typeof users);
      addPropertyRow();
      // addPropertyRow();
    };

    makeFirstPropertyRow();
  }, []);

  const handleInputChange = (e, index) => {
    if (e.target.name !== "") {
      // probably a PointerEvent due to MUI Select
      setInputData({
        ...inputData,
        [e.target.name]: e.target.value,
      });
    } else {
      // regular onChange event
      setInputData({
        ...inputData,
        [e.target.id]: e.target.value,
      });
    }

    if (e.target.id === "DocumentID") {
      autoFillDocumentData(e.target.value, setDocLocked, setInputData);
    }

    // if (e.target.id === "PropertyID") {
    //   // verify if Property already exists
    //   fetchPropertyData(e.target.value);
    // }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setInputData({
      ...inputData,
      Link: file,
    });
  };

  const docSubheadered = (
    <FormSubheadered subheader="Document Details">
      <FormRow segments={3}>
        <SmallTextField id="DocumentID" label="Document Name" value={inputData.DocumentID} onChange={handleInputChange} required />
        <AggregatedFormSelect label="Type" id="DocumentType" value={inputData.DocumentType} onChange={handleInputChange} options={types} readOnly={docLocked} required />
        <FormDatePicker
          id="DateIssued"
          label="Date Issued"
          value={inputData.DateIssued}
          onChange={(val) =>
            setInputData({
              ...inputData,
              DateIssued: val,
            })
          }
          readOnly={docLocked}
        />
      </FormRow>
      <FormRow segments={3}>
        <AggregatedFormSelect label="IssuedBy" id="IssuedBy" value={inputData.IssuedBy} onChange={handleInputChange} disabled={docLocked} options={users} optionnamegetter={getFullName} />
        <AggregatedFormSelect label="ReceivedBy" id="ReceivedBy" value={inputData.ReceivedBy} onChange={handleInputChange} disabled={docLocked} options={users} optionnamegetter={getFullName} />
        <FormFileUpload id="Link" onChange={handleFileChange} disabled={docLocked} />
      </FormRow>
    </FormSubheadered>
  );

  const NextPropRowButton = () => {
    const addRowFunc = (e) => {
      addPropertyRow();
      setPropRowToDisplay(propRowToDisplay + 1);
    };
    const nextRowFunc = (e) => {
      setPropRowToDisplay(propRowToDisplay + 1);
    };
    const addRow = <IconButton variant="contained" children={<Add />} color="primary" onClick={addRowFunc} />;
    const nextRow = <IconButton variant="contained" children={<East />} color="primary" onClick={nextRowFunc} />;
    return propRowToDisplay === propertyRows.length - 1 ? addRow : nextRow;
  };

  const PrevPropRowButton = () => {
    const prevRowFunc = (e) => {
      setPropRowToDisplay(Math.max(0, propRowToDisplay - 1));
    };
    const prevRow = <IconButton variant="contained" children={<West />} color="primary" onClick={prevRowFunc} />;
    return propRowToDisplay === 0 ? <></> : prevRow;
  };

  const DeletePropRowButton = () => {
    const delPropRowFunc = (e) => {
      const index = propRowToDisplay;
      setPropertyRows([...propertyRows.slice(0, index), ...propertyRows.slice(index)]);
      setRowHandlers([...rowHandlers.slice(0, index), ...rowHandlers.slice(index)]);
      setPropRowToDisplay(Math.min(propertyRows.length - 1, index));
    };
    const delRow = <IconButton variant="contained" children={<Close />} color="error" onClick={delPropRowFunc} />;
    return propertyRows.length > 1 ? delRow : <></>;
  };

  return (
    <Layout pageTitle="INSERT">
      <Box sx={{ padding: 2, margin: 1 }}>
        <main>
          <PaimsForm header="Insert a New Record into the Database" onSubmit={(e) => handleSubmit(e, inputData)}>
            {docSubheadered}
            <SubmitButton
              text="Only Submit Document"
              onClick={(e) => {
                insertDocument(e, inputData);
              }}
            />
            <Paper sx={{ p: 2, backgroundColor: "#f3f3f3" }}>
              <Box display="flex" flexDirection="row" height={36}>
                <Typography width="50%" variant="h9" fontWeight={"bold"}>
                  Property {propRowToDisplay + 1}
                </Typography>
                <Box width="50%" display="flex" flexDirection="row" justifyContent="end">
                  <DeletePropRowButton />
                </Box>
              </Box>
              {propertyRows.map((propRowData, index) => {
                const hide = <></>;
                const propUI = <PropertyRow rownum={index} propRowData={propRowData} handleChange={rowHandlers[index]} dropdowndata={{ users, statuses, categories, locations, types }} />;
                const res = <div key={`PropertyRow_${index}`}>{index === propRowToDisplay ? propUI : hide}</div>;
                return res;
              })}
              <Box display="flex" flexDirection="row" justifyContent="end">
                <PrevPropRowButton />
                <NextPropRowButton />
              </Box>
            </Paper>
            <SubmitButton text="Submit All & Insert Property" />
          </PaimsForm>
        </main>
      </Box>
    </Layout>
  );
};

export const Head = () => <title>Insert Record</title>;

export default InsertRecord;