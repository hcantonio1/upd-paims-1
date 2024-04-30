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
    if (e.target.id === "SupplierID") {
      autoFillSupplierData(e.target.value, setSupLocked, setInputData);
    }
    if (e.target.id === "PropertyID") {
      fetchPropertyData(e.target.value);
    }
    //if (e.target.id === `PurchaseOrderID_${index}`) {
    //  fetchOrderData(e.target.value);
    //}
  };

  const fetchPropertyData = async (propId) => {
    try {
      const propRef = doc(db, "property", propId);
      const propSnap = await getDoc(propRef);

      if (propSnap.exists()) {
        alert("A property with this ID already exists!");
        return;
      }
    } catch (error) {
      console.error("Error fetching property:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setInputData({
      ...inputData,
      Link: file,
    });
  };

  const itemSubheadered = (
    <FormSubheadered subheader="Item Details">
      <FormRow segments={3}>
        <SmallTextField
          id="PropertyID"
          label="Property ID"
          value={inputData.PropertyID}
          onChange={handleInputChange}
          type="string"
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
          }}
          title="Numbers only."
          required
        />
        <SmallTextField id="PropertyName" label="Property Name" value={inputData.PropertyName} onChange={handleInputChange} />
      </FormRow>
      <FormRow segments={4}>
        <AggregatedFormSelect id="TrusteeID" label="Trustee" value={inputData.TrusteeID} onChange={handleInputChange} options={users} optionnamegetter={getFullName} />
        <AggregatedFormSelect id="CategoryID" label="Category" value={inputData.CategoryID} onChange={handleInputChange} options={categories} />
        <AggregatedFormSelect id="StatusID" label="Status" value={inputData.StatusID} onChange={handleInputChange} options={statuses} />
        <AggregatedFormSelect id="LocationID" label="Location" value={inputData.LocationID} onChange={handleInputChange} options={locations} optionnamegetter={getFullLoc} />
      </FormRow>
    </FormSubheadered>
  );

  const poSubheadered = (
    <FormSubheadered subheader="Purchase Order">
      <FormRow segments={4}>
        <SmallTextField id="PurchaseOrderID" label="Purchase Order ID" value={inputData.PurchaseOrderID} onChange={handleInputChange} pattern="[0-9]*" title="Numbers only." required />
        <SmallTextField
          id="TotalCost"
          label="Total Cost"
          value={inputData.TotalCost}
          onChange={handleInputChange}
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
            min: "0",
            step: "any",
          }}
          title="Please enter a positive number."
          required
          readOnly={orderLocked}
        />
        <FormDatePicker
          label="Purchase Date"
          id="PurchaseDate"
          value={inputData.PurchaseDate}
          onChange={(val) => {
            setInputData({
              ...inputData,
              PurchaseDate: val,
            });
          }}
        />
      </FormRow>
    </FormSubheadered>
  );
  const supplierSubheadered = (
    <FormSubheadered subheader="Supplier Details">
      <FormRow segments={3}>
        <SmallTextField id="SupplierID" label="Supplier ID" value={inputData.SupplierID} onChange={handleInputChange} pattern="[0-9]*" title="Numbers only." required />
        <SmallTextField id="SupplierName" label="Supplier Name" value={inputData.SupplierName} onChange={handleInputChange} readOnly={supLocked} required />
        <SmallTextField id="SupplierContact" label="Contact Number" value={inputData.SupplierContact} onChange={handleInputChange} readOnly={supLocked} required />
      </FormRow>
      <FormRow segments={4}>
        <SmallTextField id="UnitNumber" label="Unit Number" value={inputData.UnitNumber} onChange={handleInputChange} readOnly={supLocked} />
        <SmallTextField id="StreetName" label="Street Name" value={inputData.StreetName} onChange={handleInputChange} readOnly={supLocked} />
        <SmallTextField id="City" label="City" value={inputData.City} onChange={handleInputChange} readOnly={supLocked} />
        <SmallTextField id="State" label="State" value={inputData.State} onChange={handleInputChange} readOnly={supLocked} />
      </FormRow>
    </FormSubheadered>
  );

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

  const NextPropRow = () => {
    const addProp = (
      <IconButton
        variant="contained"
        children={<Add />}
        color="primary"
        onClick={(e) => {
          addPropertyRow();
          setPropRowToDisplay(propRowToDisplay + 1);
        }}
      />
    );
    const right = (
      <IconButton
        variant="contained"
        children={<East />}
        color="primary"
        onClick={(e) => {
          setPropRowToDisplay(propRowToDisplay + 1);
        }}
      />
    );
    return propRowToDisplay === propertyRows.length - 1 ? addProp : right;
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
              <Box display="flex" flexDirection="row">
                <Typography width="50%" variant="h9" fontWeight={"bold"}>
                  Property {propRowToDisplay + 1}
                </Typography>
                <Box width="50%" display="flex" flexDirection="row" justifyContent="end">
                  <IconButton children={<Close />} variant="contained" color="error" />
                </Box>
              </Box>
              {/* {itemSubheadered}
              {poSubheadered}
              {supplierSubheadered} */}
              {propertyRows.map((propRowData, index) => {
                const hide = <></>;
                const propUI = <PropertyRow rownum={index} propRowData={propRowData} handleChange={rowHandlers[index]} dropdowndata={{ users, statuses, categories, locations, types }} />;
                const res = <div key={`PropertyRow_${index}`}>{index === propRowToDisplay ? propUI : hide}</div>;
                return res;
              })}
              <Box display="flex" flexDirection="row" justifyContent="end">
                <IconButton
                  variant="contained"
                  children={<West />}
                  color="primary"
                  onClick={(e) => {
                    setPropRowToDisplay(Math.max(0, propRowToDisplay - 1));
                  }}
                />
                <NextPropRow />
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
