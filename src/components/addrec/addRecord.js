import React, { useState, useEffect } from "react";
import Layout from "../common/layout";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import { Close, Add, West, East } from "@mui/icons-material";
import { PaimsForm, FormSubheadered, FormRow } from "../paimsform/paimsForm";
import SmallTextField from "../paimsform/smallTextField";
import { AggregatedFormSelect } from "../paimsform/formSelect";
import SubmitButton from "../paimsform/submitButton";
import FormDatePicker from "../paimsform/formDatePicker";
import { FormFileUpload } from "../paimsform/formFileUpload";

import { fetchDeptUsers, fetchCategories, fetchStatuses, fetchDeptLocations, fetchTypes } from "../../fetchutils/fetchdropdowndata";
import { fetchDocumentAutofill, fetchSupplierAutofill } from "../../fetchutils/formautofill2";
import dayjs from "dayjs";
import { insertDocument, handleSubmit } from "./handleinsert";

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

const indexedPropRowFields = (index) => {
  const propRowData = {};
  for (const key in PROPERTY_ROW_FIELDS) {
    const newkey = `${key}_${index}`;
    propRowData[newkey] = PROPERTY_ROW_FIELDS[key];
  }
  return propRowData;
};

const InsertRecord = () => {
  const [docData, setDocData] = useState({ DocumentID: "", DocumentType: "", DateIssued: null, IssuedBy: "", ReceivedBy: "", Link: "", holdLink: "" });

  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);
  const [docLocked, setDocLocked] = useState(false);

  const [propertyRows, setPropertyRows] = useState([indexedPropRowFields(0)]);
  const [propRowToDisplay, setPropRowToDisplay] = useState(0);
  const [propRowLocks, setPropRowLocks] = useState([{ orderLocked: false, supLocked: false }]);

  const addPropertyRow = () => {
    const rownum = propertyRows.length;
    const propRowData = indexedPropRowFields(rownum);
    setPropertyRows([...propertyRows, propRowData]);
    setPropRowLocks([...propRowLocks, { orderLocked: false, supLocked: false }]);
    setPropRowToDisplay(propRowToDisplay + 1);
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

  const suppliersForAutofill = propertyRows.map((propRowData, index) => propRowData[`SupplierID_${index}`]);
  useEffect(() => {
    const autofillSupplierData = async () => {
      const index = propRowToDisplay;
      const supplierAutofillData = await fetchSupplierAutofill(suppliersForAutofill[index]);
      if (!!supplierAutofillData) {
        const supData = supplierAutofillData;
        setPropertyRows((prev) => {
          const newPropertyRows = [...prev];
          const myRow = newPropertyRows[index];
          const myNewRow = {
            ...myRow,
            [`City_${index}`]: supData.City,
            [`State_${index}`]: supData.State,
            [`StreetName_${index}`]: supData.StreetName,
            [`SupplierContact_${index}`]: supData.SupplierContact,
            [`SupplierName_${index}`]: supData.SupplierName,
            [`UnitNumber_${index}`]: parseInt(supData.UnitNumber),
          };
          newPropertyRows[index] = myNewRow;
          return newPropertyRows;
        });
      }
    };
    autofillSupplierData();
    console.log("infity??");
  }, [suppliersForAutofill, propRowToDisplay]);

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

    // const keyType = propRowKey.split("_")[0];
    // if (keyType === "SupplierID") {
    //   autofillPropRowSupp(index, e.target.value, setPropRowLocks, setPropertyRows);
    // }
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
      // const newPropertyRows = [...propertyRows];
      // newPropertyRows.splice(propRowToDisplay, 1);
      // setPropertyRows(newPropertyRows);
      // setPropRowToDisplay(Math.min(propertyRows.length - 1, propRowToDisplay));
    };
    const delRow = <IconButton variant="contained" children={<Close />} color="error" onClick={delPropRowFunc} />;
    return propertyRows.length > 1 ? delRow : <></>;
  };

  return (
    <Layout pageTitle="INSERT">
      <Box sx={{ padding: 2, margin: 1 }}>
        <main>
          <PaimsForm
            header="Encode a Document into the Database"
            onSubmit={(e) => {
              handleSubmit(e, docData, propertyRows);
            }}
          >
            {docSubheadered}
            <SubmitButton
              text="Only Submit Document Info"
              onClick={(e) => {
                insertDocument(e, docData);
              }}
              disabled={docLocked}
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
                const propUI = (
                  <PropertyRow
                    rownum={index}
                    propRowData={propRowData}
                    locks={propRowLocks[index]}
                    handleChange={(e) => {
                      handlePropRowChange(e, index);
                    }}
                    dropdowndata={{ users, statuses, categories, locations, types }}
                    podatepickerfunc={(val) => {
                      const newPropertyRows = [...propertyRows];
                      newPropertyRows[index][`PurchaseDate_${index}`] = val;
                      setPropertyRows(newPropertyRows);
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
            <SubmitButton text="Insert All Properties" />
          </PaimsForm>
        </main>
      </Box>
    </Layout>
  );
};

export const Head = () => <title>Insert Record</title>;

export default InsertRecord;
