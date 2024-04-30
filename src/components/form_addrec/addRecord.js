import * as React from "react";
import { useState, useEffect } from "react";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import { Close, Add, West, East } from "@mui/icons-material";
import { autoFillDocumentData, autoFillSupplierData } from "./formautofill";
import { fetchDeptUsers, fetchCategories, fetchStatuses, fetchDeptLocations, fetchTypes } from "./fetchdropdowndata";
import { insertDocument, handleSubmit } from "./handleinsert";

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
  const [docData, setDocData] = useState({ DocumentID: "", DocumentType: "", DateIssued: null, IssuedBy: "", ReceivedBy: "", Link: "" });

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

      // if (e.target.id === "SupplierID") {
      //   autoFillSupplierData(e.target.value, setSupLocked, setdocData);
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
      if (propertyRows.length === 0) {
        addPropertyRow();
      }
    };

    makeFirstPropertyRow();
  }, []);

  const handleInputChange = (e) => {
    if (e.target.name !== "") {
      // probably a PointerEvent due to MUI Select
      setDocData({
        ...docData,
        [e.target.name]: e.target.value,
      });
    } else {
      // regular onChange event
      setDocData({
        ...docData,
        [e.target.id]: e.target.value,
      });
    }

    if (e.target.id === "DocumentID") {
      autoFillDocumentData(e.target.value, setDocLocked, setDocData);
    }

    // if (e.target.id === "PropertyID") {
    //   // verify if Property already exists
    //   fetchPropertyData(e.target.value);
    // }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setDocData({
      ...docData,
      Link: file,
    });
  };

  const docSubheadered = (
    <FormSubheadered subheader="Document Details">
      <FormRow segments={3}>
        <SmallTextField id="DocumentID" label="Document Name" value={docData.DocumentID} onChange={handleInputChange} required />
        <AggregatedFormSelect label="Type" id="DocumentType" value={docData.DocumentType} onChange={handleInputChange} options={types} readOnly={docLocked} required />
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
        <AggregatedFormSelect label="IssuedBy" id="IssuedBy" value={docData.IssuedBy} onChange={handleInputChange} disabled={docLocked} options={users} optionnamegetter={getFullName} />
        <AggregatedFormSelect label="ReceivedBy" id="ReceivedBy" value={docData.ReceivedBy} onChange={handleInputChange} disabled={docLocked} options={users} optionnamegetter={getFullName} />
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
      setPropRowToDisplay(Math.min(propertyRows.length - 1, propRowToDisplay + 1));
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
      return;
      const index = propRowToDisplay;
      setPropertyRows([...propertyRows.slice(0, index), ...propertyRows.slice(index + 1)]);
      setRowHandlers([...rowHandlers.slice(0, index), ...rowHandlers.slice(index + 1)]);

      // propertyRows, probably has not been modified yet at this point
      setPropRowToDisplay(Math.min(propertyRows.length - 1, index));
    };
    const delRow = <IconButton variant="contained" children={<Close />} color="error" onClick={delPropRowFunc} />;
    return propertyRows.length > 1 ? delRow : <></>;
  };

  return (
    <Layout pageTitle="INSERT">
      <Box sx={{ padding: 2, margin: 1 }}>
        <main>
          <PaimsForm header="Insert a New Record into the Database" onSubmit={(e) => {}}>
            {docSubheadered}
            <SubmitButton
              text="Only Submit Document"
              onClick={(e) => {
                insertDocument(e, docData);
              }}
            />
            <Paper sx={{ p: 2, backgroundColor: "#f3f3f3" }}>
              <Box display="flex" flexDirection="row" height={36}>
                <Typography width="50%" variant="h9" fontWeight={"bold"}>
                  Property {propRowToDisplay + 1}
                </Typography>
                {/* <Box width="50%" display="flex" flexDirection="row" justifyContent="end">
                  <DeletePropRowButton />
                </Box> */}
              </Box>
              {propertyRows.map((propRowData, index) => {
                const propUI = (
                  <PropertyRow
                    rownum={index}
                    propRowData={propRowData}
                    handleChange={rowHandlers[index]}
                    dropdowndata={{ users, statuses, categories, locations, types }}
                    podatepickerfunc={(val) => {
                      propRowData[`PurchaseDate_${index}`] = val;
                      setPropertyRows([...propertyRows.slice(0, index), propRowData, ...propertyRows.slice(index + 1)]);
                    }}
                  />
                );
                const res = <div key={`PropertyRow_${index}`}>{index === propRowToDisplay ? propUI : <></>}</div>;
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
