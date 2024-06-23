import React, { useState, useEffect } from "react";
import _ from "lodash";
import Layout from "../common/layout";
import { Box, Typography, Paper, Snackbar, Alert } from "@mui/material";
import { PaimsForm, FormSubheadered, FormRow, SubmitButton } from "../paimsform/paimsForm";
import SmallTextField from "../paimsform/smallTextField";
import { AggregatedFormSelect } from "../paimsform/formSelect";
import FormDatePicker from "../paimsform/formDatePicker";
import { FormFileUpload } from "../paimsform/formFileUpload";
import PropertyRow, { AddPropRowButton, DeletePropRowButton, NextPropRowButton, PrevPropRowButton } from "./propertyRow";

import { fetchDeptUsers, fetchCategories, fetchStatuses, fetchDeptLocations, fetchTypes } from "../../fetchutils/fetchdropdowndata";
import { fetchDocumentAutofill, fetchSupplierAutofill, fetchPOAutofill } from "../../fetchutils/formautofill";
import dayjs from "dayjs";

import { db, storage } from "../../../firebase-config";
import { Timestamp, doc, setDoc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "@firebase/storage";
import { getUser } from "../../services/auth.js";

const PROPERTY_ROW_FIELDS = {
  CategoryID: "",
  LocationID: "",
  PropertyID: "",
  PropertyName: "",
  TrusteeID: "",
  UnitValue: "",
  UnitOfMeasure: "",
  PropertyFound: "",
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

const emptyDocDataErrors = { DocumentID: [], DocumentType: [], DateIssued: [], IssuedBy: [], ReceivedBy: [], Link: [] };
const emptyPropRowErrors = {
  CategoryID: [],
  LocationID: [],
  PropertyID: [],
  PropertyName: [],
  TrusteeID: [],
  UnitValue: [],
  UnitOfMeasure: [],
  PropertyFound: [],
  StatusID: [],
  SupplierID: [],
  PurchaseDate: [],
  PurchaseOrderID: [],
  TotalCost: [],
  City: [],
  State: [],
  StreetName: [],
  SupplierContact: [],
  SupplierName: [],
  UnitNumber: [],
};

const InsertRecord = () => {
  const [docData, setDocData] = useState({ DocumentID: "", DocumentType: "", DateIssued: null, IssuedBy: "", ReceivedBy: "", Link: "", holdLink: "" });

  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);
  const [docLocked, setDocLocked] = useState(false);

  // each element of propertyRows is called propRowData
  const [propertyRows, setPropertyRows] = useState([{ ...PROPERTY_ROW_FIELDS }]);
  const [propRowToDisplay, setPropRowToDisplay] = useState(0);
  const [propRowLocks, setPropRowLocks] = useState([{ orderLocked: false, supLocked: false }]);

  const [errors, setErrors] = useState({ count: 0, errorTexts: [], docData: _.cloneDeep(emptyDocDataErrors), propertyRows: [_.cloneDeep(emptyPropRowErrors)] });
  const [toastState, setToastState] = useState({ isTriggered: false, errorText: "" });

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

  const currPropRowPO = propertyRows[propRowToDisplay].PurchaseOrderID;
  useEffect(() => {
    const autofillPOData = async () => {
      const poAutofillData = await fetchPOAutofill(currPropRowPO);
      if (!!poAutofillData) {
        // setDocLocked(true);
        const poData = poAutofillData;
        setPropertyRows((prev) => {
          const newPropertyRows = [...prev];
          const myRow = newPropertyRows[propRowToDisplay];
          const myNewRow = {
            ...myRow,
            TotalCost: poData.TotalCost.toString(),
            PurchaseDate: dayjs(poData.PurchaseDate.toDate()),
          };
          newPropertyRows[propRowToDisplay] = myNewRow;
          return newPropertyRows;
        });
        return;
      }
      // setDocLocked(false);
    };
    if (currPropRowPO) {
      autofillPOData();
    }
  }, [currPropRowPO, propRowToDisplay]);

  useEffect(() => {
    const isPropertyInDatabase = async (propId) => {
      try {
        const propRef = doc(db, "property", propId);
        const propSnap = await getDoc(propRef);
        if (propSnap.exists()) return true;
      } catch (error) {
        console.error("Error fetching property:", error);
      }
      return false;
    };
    const gatherFormErrors = () => {
      let errorsThisCheck = 0;
      const errorTexts = [];
      const docDataErrors = { DocumentID: [], DocumentType: [], DateIssued: [], IssuedBy: [], ReceivedBy: [], Link: [] };

      // docData
      if (!docData.DocumentID) {
        docDataErrors.DocumentID.push("required");
        errorTexts.push("Document Data\\DocumentID: required.");
        errorsThisCheck++;
      }
      if (docData.IssuedBy && docData.ReceivedBy && docData.IssuedBy === docData.ReceivedBy) {
        docDataErrors.IssuedBy.push("IssuedBy and ReceivedBy cannot be the same person");
        docDataErrors.ReceivedBy.push("IssuedBy and ReceivedBy cannot be the same person");
        errorTexts.push("Document Data\\Issued By: IssuedBy and ReceivedBy cannot be the same person");
        errorsThisCheck++;
      }

      const propertyRowsErrors = propertyRows.map((propRowData, index) => {
        const p = async (propRowData) => {
          const newPropRowDataErrors = _.cloneDeep(emptyPropRowErrors);

          // property details errors
          if (!propRowData.PropertyID) {
            newPropRowDataErrors.PropertyID.push("required");
            errorTexts.push(`Property Row ${index + 1}\\PropertyID: required`);
            errorsThisCheck++;
          }
          if (propRowData.PropertyID && !/^\d+$/.test(propRowData.PropertyID)) {
            newPropRowDataErrors.PropertyID.push("Numbers only");
            errorTexts.push(`Property Row ${index + 1}\\PropertyID: Numbers only`);
            errorsThisCheck++;
          }
          // error++: To check if the property already exists, let's just use another useEffect
          if (propRowData.PropertyID && (await isPropertyInDatabase(propRowData.PropertyID))) {
            newPropRowDataErrors.PropertyID.push("Property already exists");
            errorTexts.push(`Property Row ${index + 1}\\PropertyID: Property already exists`);
            errorsThisCheck++;
          }
          if (propRowData.UnitValue && !/^\d+$/.test(propRowData.UnitValue)) {
            newPropRowDataErrors.UnitValue.push("Numbers only");
            errorTexts.push(`Property Row ${index + 1}\\UnitValue: Numbers only`);
            errorsThisCheck++;
          }
          if (propRowData.UnitValue && parseInt(propRowData.UnitValue) < 0) {
            newPropRowDataErrors.UnitValue.push("Please input a number at least zero");
            errorTexts.push(`Property Row ${index + 1}\\UnitValue: Please input a number at least zero`);
            errorsThisCheck++;
          }
          if (propRowData.UnitValue && parseInt(propRowData.UnitValue) > 200000000) {
            newPropRowDataErrors.UnitValue.push("Please input a reasonable amount");
            errorTexts.push(`Property Row ${index + 1}\\UnitValue: Please input a reasonable amount`);
            errorsThisCheck++;
          }

          // PO errors
          if (propRowData.TotalCost && !/^\d+$/.test(propRowData.TotalCost)) {
            newPropRowDataErrors.TotalCost.push("Numbers only");
            errorTexts.push(`Property Row ${index + 1}\\TotalCost: Numbers only`);
            errorsThisCheck++;
          }
          if (propRowData.TotalCost && parseInt(propRowData.TotalCost) <= 0) {
            newPropRowDataErrors.TotalCost.push("Please input a positive value");
            errorTexts.push(`Property Row ${index + 1}\\TotalCost: Please input a positive value`);
            errorsThisCheck++;
          }
          if (propRowData.TotalCost && parseInt(propRowData.TotalCost) > 200000000) {
            newPropRowDataErrors.TotalCost.push("Please input a reasonable amount");
            errorTexts.push(`Property Row ${index + 1}\\TotalCost: Please input a reasonable amount`);
            errorsThisCheck++;
          }
          if (propRowData.TotalCost && parseInt(propRowData.TotalCost) < 50000 && docData.DocumentType === "PAR") {
            newPropRowDataErrors.TotalCost.push("PAR total cost should be at least P50,000");
            errorTexts.push(`Property Row ${index + 1}\\TotalCost: PAR total cost should be at least P50,000`);
            errorsThisCheck++;
          }
          if (propRowData.TotalCost && parseInt(propRowData.TotalCost) >= 50000 && docData.DocumentType === "ICS") {
            newPropRowDataErrors.TotalCost.push("ICS total cost should be below P50,000");
            errorTexts.push(`Property Row ${index + 1}\\TotalCost: ICS total cost should be below P50,000`);
            errorsThisCheck++;
          }

          // supplier errors
          if (propRowData.SupplierID && !/^\d+$/.test(propRowData.SupplierID)) {
            newPropRowDataErrors.SupplierID.push("Numbers only");
            errorTexts.push(`Property Row ${index + 1}\\SupplierID: Numbers only`);
            errorsThisCheck++;
          }
          if (propRowData.SupplierContact && !/^\d+$/.test(propRowData.SupplierContact)) {
            newPropRowDataErrors.SupplierContact.push("Numbers only");
            errorTexts.push(`Property Row ${index + 1}\\SupplierContact: Numbers only`);
            errorsThisCheck++;
          }
          if (propRowData.UnitNumber && !/^\d+$/.test(propRowData.UnitNumber)) {
            newPropRowDataErrors.UnitNumber.push("Numbers only");
            errorTexts.push(`Property Row ${index + 1}\\UnitNumber: Numbers only`);
            errorsThisCheck++;
          }

          return newPropRowDataErrors;
        };
        return p(propRowData);
      });

      Promise.all(propertyRowsErrors).then((propRowDataErrors) => {
        const newErrors = { count: errorsThisCheck, errorTexts: errorTexts, docData: docDataErrors, propertyRows: propRowDataErrors };
        setErrors(newErrors);
      });
    };
    if (docData.DocumentID || propertyRows[propRowToDisplay].PropertyID) {
      gatherFormErrors();
    }
  }, [docData, propertyRows, propRowToDisplay]);

  const handleSubmit = (e, docData, propertyRows, errors) => {
    e.preventDefault();

    console.log("I received document:", docData);
    console.log(`I received properties[${propertyRows.length}]:`, propertyRows);

    if (errors.count !== 0) {
      console.log("I have received errors", errors);
      setToastState({ isTriggered: true, errorText: errors.errorTexts[0] });
      return;
    }

    const propPromises = propertyRows.map((propRowData, index) => {
      const p = async () => {
        try {
          await insertPropRow(e, propRowData, docData.DocumentID);
        } catch (error) {
          console.log(`Error inserting Property ${index}.`);
          alert(`Property ${index} (and succeeding properties) were not inserted.`);
        }
      };
      return p();
    });

    Promise.all([insertDocument(e, docData), ...propPromises])
      .then(() => {
        alert("Successfully inserted all properties!");
        window.location.reload();
      })
      .catch((error) => {
        console.log("Some properties were not inserted.", error);
      });
  };

  const insertPropRow = async (e, propRowData, documentID) => {
    e.preventDefault();

    // try {
    await setDoc(doc(db, "supplier", propRowData.SupplierID), {
      City: propRowData.City,
      State: propRowData.State,
      StreetName: propRowData.StreetName,
      SupplierContact: propRowData.SupplierContact.toString(),
      SupplierID: parseInt(propRowData.SupplierID),
      SupplierName: propRowData.SupplierName,
      UnitNumber: parseInt(propRowData.UnitNumber),
    });

    var docObject = {};
    docObject["a"] = documentID;
    await setDoc(doc(db, "pending_changes", propRowData.PropertyID), {
      CategoryID: parseInt(propRowData.CategoryID),
      Documents: docObject,
      isArchived: 0,
      // isApproved: 0,
      LocationID: parseInt(propRowData.LocationID),
      PropertyID: parseInt(propRowData.PropertyID),
      PropertyName: propRowData.PropertyName,
      TrusteeID: parseInt(propRowData.TrusteeID),
      StatusID: parseInt(propRowData.StatusID),
      UnitValue: parseInt(propRowData.UnitValue),
      UnitOfMeasure: propRowData.UnitOfMeasure,
      PropertyFound: propRowData.PropertyFound,
      SupplierID: parseInt(propRowData.SupplierID),
      PurchaseOrderID: propRowData.PurchaseOrderID,
      VerNum: "a",
    });
    await setDoc(doc(db, "purchase_order", propRowData.PurchaseOrderID), {
      PurchaseDate: Timestamp.fromDate(new Date(propRowData.PurchaseDate)),
      PurchaseOrderID: propRowData.PurchaseOrderID,
      SupplierID: parseInt(propRowData.SupplierID),
      TotalCost: parseInt(propRowData.TotalCost),
    });
    // alert("Successfully inserted!");
    // window.location.reload();
    // } catch (error) {
    //   console.error("Error inserting document:", error);
    //   // alert("Failed to insert record.");
    // }
  };

  const insertDocument = async (e, documentData) => {
    e.preventDefault();
    try {
      console.log("Uploading file to Firebase Storage");
      const fileRef = ref(storage, `${getUser().dept}/${documentData.holdLink.name}`);
      await uploadBytes(fileRef, documentData.holdLink);
      var fileUrl = await getDownloadURL(fileRef);
      console.log("File uploaded successfully:", fileUrl);

      if (documentData.holdLink.name === undefined) {
        fileUrl = documentData.Link;
      }

      await setDoc(doc(db, "item_document", documentData.DocumentID), {
        DateIssued: Timestamp.fromDate(new Date(documentData.DateIssued)),
        DocumentID: documentData.DocumentID,
        DocumentType: documentData.DocumentType,
        IssuedBy: documentData.IssuedBy,
        Link: fileUrl,
        ReceivedBy: documentData.ReceivedBy,
      });
      // alert("Successfully inserted!");
      // window.location.reload();
    } catch (error) {
      console.error("Error inserting document:", error);
      alert("Failed to insert document.");
    }
  };

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

  const addPropertyRow = () => {
    const propRowData = { ...PROPERTY_ROW_FIELDS };
    const newErrors = { ...errors };
    newErrors.propertyRows.push(_.cloneDeep(emptyPropRowErrors));
    setPropertyRows([...propertyRows, propRowData]);
    setErrors(newErrors);
    setPropRowLocks([...propRowLocks, { orderLocked: false, supLocked: false }]);
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
    setPropRowToDisplay(Math.min(newPropertyRows.length - 1, propRowToDisplay));
  };

  const docFieldHasError = (fieldID) => {
    // return helperText when it has error
    if (errors.docData[fieldID].length === 0) return;
    return errors.docData[fieldID][0];
  };

  const docSubheadered = (
    <FormSubheadered subheader="Document Details">
      <FormRow segments={3}>
        <SmallTextField
          id="DocumentID"
          label="Document Name"
          value={docData.DocumentID}
          onChange={handleDocChange}
          required
          error={!!docFieldHasError("DocumentID")}
          helperText={docFieldHasError("DocumentID")} // notice small "T"
        />
        <AggregatedFormSelect label="Type" id="DocumentType" value={docData.DocumentType} onChange={handleDocChange} options={types} readOnly={docLocked} required />
        <FormDatePicker id="DateIssued" label="Date Issued" value={docData.DateIssued} onChange={(val) => setDocData({ ...docData, DateIssued: val })} readOnly={docLocked} />
      </FormRow>
      <FormRow segments={3}>
        <AggregatedFormSelect
          label="IssuedBy"
          id="IssuedBy"
          value={docData.IssuedBy}
          onChange={handleDocChange}
          disabled={docLocked}
          options={users}
          error={!!docFieldHasError("IssuedBy")}
          helpertext={docFieldHasError("IssuedBy")} // notice small "T"
        />
        <AggregatedFormSelect
          label="ReceivedBy"
          id="ReceivedBy"
          value={docData.ReceivedBy}
          onChange={handleDocChange}
          disabled={docLocked}
          options={users}
          error={!!docFieldHasError("ReceivedBy")}
          helpertext={docFieldHasError("ReceivedBy")} // notice small "T"
        />
        <FormFileUpload id="Link" filename={docData.holdLink?.name} onChange={handleFileChange} disabled={docLocked} />
      </FormRow>
    </FormSubheadered>
  );

  return (
    <Layout pageTitle="INSERT">
      <Box sx={{ display: "flex", flexDirection: "column", padding: 2, margin: 1 }}>
        <Snackbar
          open={toastState.isTriggered}
          autoHideDuration={6000}
          onClose={() => {
            setToastState({ isTriggered: false, errorText: "" });
          }}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            {toastState.errorText}
          </Alert>
        </Snackbar>
        <main>
          <PaimsForm header="Encode a Document into the Database" onSubmit={(e) => handleSubmit(e, docData, propertyRows, errors)}>
            {docSubheadered}
            {/* <SubmitButton text="Only Submit Document" onClick={(e) => insertDocument(e, docData)} disabled={docLocked} /> */}
            <Paper sx={{ p: 2, backgroundColor: "#f3f3f3" }}>
              <Box display="flex" flexDirection="row" height={36}>
                <Typography width="50%" variant="h9" fontWeight={"bold"}>
                  Property {propRowToDisplay + 1}
                </Typography>
                <Box width="50%" display="flex" flexDirection="row" justifyContent="end">
                  <DeletePropRowButton onClick={delPropRowButtonFunc} disabled={propertyRows.length === 1} />
                </Box>
              </Box>
              <PropertyRow
                propRowData={propertyRows[propRowToDisplay]}
                errors={errors.propertyRows[propRowToDisplay]}
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
                {propertyRows.length === 1 ? <></> : <PrevPropRowButton onClick={prevPropRowButtonFunc} />}
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
