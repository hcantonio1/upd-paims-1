import React, { useEffect, useState } from "react";
import _ from "lodash";
import { doc, updateDoc, setDoc, Timestamp, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../../../firebase-config";
import { fetchDeptLocations, fetchDeptUsers, fetchStatuses, fetchTypes } from "../../fetchutils/fetchdropdowndata";

import { PaimsForm, FormSubheadered, FormRow, SubmitButton } from "../paimsform/paimsForm";
import SmallTextField from "../paimsform/smallTextField";
import { AggregatedFormSelect } from "../paimsform/formSelect";
import FormDatePicker from "../paimsform/formDatePicker";
import { FormFileUpload } from "../paimsform/formFileUpload";

import dayjs from "dayjs";
import { fetchDocumentAutofill, fetchPropertyAutofill } from "../../fetchutils/formautofill";
import { copyPages, nextChar } from "./mergedpdf";
import { getUser } from "../../services/auth.js";

const emptyPropertyErrors = {
  LocationID: [],
  PropertyID: [],
  TrusteeID: [],
  StatusID: [],
  UnitValue: [],
  PropertyFound: [],
  DocumentID: [],
  DocumentType: [],
  DateIssued: [],
  IssuedBy: [],
  ReceivedBy: [],
  Link: [],
};

const UpdateProp = () => {
  const [formData, setFormData] = useState({
    StatusID: "",
    TrusteeID: "",
    LocationID: "",
    PropertyID: "",
    UnitValue: "",
    PropertyFound: "",
    parID: {},
    iirupID: {},
    icsID: {},
    DocumentID: "",
    DocumentType: "",
    DateIssued: null,
    IssuedBy: "",
    Link: "",
    holdLink: "",
    ReceivedBy: "",
    Documents: {},
    VerNum: "",
  });

  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);
  const [docLocked, setDocLocked] = useState(false);

  const [propertyFound, setPropertyFound] = useState(false);
  const [formErrors, setFormErrors] = useState(_.cloneDeep(emptyPropertyErrors));

  useEffect(() => {
    const fetchdropdowndata = async () => {
      setUsers(await fetchDeptUsers());
      setLocations(await fetchDeptLocations());
      setStatuses(await fetchStatuses());
      setTypes(await fetchTypes());
    };
    fetchdropdowndata();
  }, []);

  const isFoundDropdown = [
    { text: "Property is found", value: true },
    { text: "Property is not found", value: false },
  ];

  useEffect(() => {
    const autofillDocumentData = async () => {
      const documentAutofillData = await fetchDocumentAutofill(formData.DocumentID);
      if (!!documentAutofillData) {
        setDocLocked(true);
        setFormData((prev) => {
          delete documentAutofillData.DocumentID;
          const docData = { ...documentAutofillData, DateIssued: dayjs(documentAutofillData.DateIssued.toDate()) };
          const oldFormData = { ...prev };
          const newFormData = Object.assign(oldFormData, docData);
          return newFormData;
        });
        return;
      }
      setDocLocked(false);
    };
    if (formData.DocumentID) {
      autofillDocumentData();
    }
  }, [formData.DocumentID]);

  useEffect(() => {
    const autofillPropertyData = async () => {
      const propertyAutofillData = await fetchPropertyAutofill(formData.PropertyID);
      if (!!propertyAutofillData) {
        setPropertyFound(true);
        setFormData((prev) => {
          const propData = propertyAutofillData;
          const propData1 = {
            ...prev,
            LocationID: parseInt(propData.LocationID),
            StatusID: parseInt(propData.StatusID),
            TrusteeID: parseInt(propData.TrusteeID),
            VerNum: propData.VerNum,
            Documents: propData.Documents,
          };
          const oldFormData = { ...prev };
          const newFormData = Object.assign(oldFormData, propData1);
          return newFormData;
        });
        return;
      }
      setPropertyFound(false);
    };

    if (formData.PropertyID) {
      autofillPropertyData();
    }
  }, [formData.PropertyID]);

  useEffect(() => {
    const gatherFormErrors = () => {
      const newFormErrors = _.cloneDeep(emptyPropertyErrors);
      if (formData.PropertyID && !/^\d+$/.test(formData.PropertyID)) newFormErrors.PropertyID.push("Numbers only");
      if (formData.IssuedBy && formData.ReceivedBy && formData.IssuedBy === formData.ReceivedBy) {
        newFormErrors.IssuedBy.push("IssuedBy and ReceivedBy cannot be the same person");
        newFormErrors.ReceivedBy.push("IssuedBy and ReceivedBy cannot be the same person");
      }
      if (formData.UnitValue && !/^\d+$/.test(formData.UnitValue)) {
        newFormErrors.UnitValue.push("Numbers only");
      }
      if (formData.UnitValue && parseInt(formData.UnitValue) < 0) {
        newFormErrors.UnitValue.push("Please input a number at least zero");
      }
      if (formData.UnitValue && parseInt(formData.UnitValue) > 200000000) {
        newFormErrors.UnitValue.push("Please input a reasonable amount");
      }
      setFormErrors(newFormErrors);
    };
    if (formData.PropertyID || formData.DocumentID) {
      gatherFormErrors();
    }
  }, [formData]);

  const handleInputChange = (e) => {
    // MUI Select sends an object target={name, value} as opposed to regular onChange which sends a target=HTML
    const formDataKey = e.target.name !== "" ? e.target.name : e.target.id;
    setFormData({ ...formData, [formDataKey]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      holdLink: file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.IssuedBy === formData.ReceivedBy) {
      alert("IssuedBy and ReceivedBy cannot be the same user.");

      return;
    }

    try {
      var docUpdate = {};
      var newVar = nextChar(formData.VerNum);
      docUpdate[`Documents.${newVar}`] = formData.DocumentID;
      var archiveStat = 0;
      if (formData.DocumentType === "IIRUP") {
        archiveStat = 1;
      }

      console.log("Uploading file to Firebase Storage");
      const fileRef = ref(storage, `${getUser().dept}` + "/" + formData.holdLink.name);
      //console.log(`${getUser().dept}` + "/" + formData.holdLink.name);
      await uploadBytes(fileRef, formData.holdLink);
      var fileUrl = await getDownloadURL(fileRef);
      //console.log("Temp File uploaded successfully:", fileUrl);

      if (formData.holdLink.name === undefined) {
        fileUrl = formData.Link;
      } else {
        const prevDoc = formData.Documents[formData.VerNum];
        const prevDocRef = doc(db, "item_document", prevDoc);
        const prevDocSnap = await getDoc(prevDocRef);
        if (prevDocSnap.exists()) {
          const prevDocData = prevDocSnap.data();
          const oldLink = prevDocData.Link;
          const combinedPdfs = await copyPages(oldLink, fileUrl);

          deleteObject(fileRef)
            .then(() => {
              console.log("File deleted successfully!");
            })
            .catch((error) => {
              console.log("Error deleting file!");
            });

          console.log("Uploading merged file to Firebase Storage");
          const newFileRef = ref(storage, `${getUser().dept}` + "/" + formData.holdLink.name);
          const metadata = {
            name: formData.holdLink.name,
            contentType: "application/pdf",
          };
          await uploadBytes(newFileRef, combinedPdfs, metadata);
          fileUrl = await getDownloadURL(newFileRef);
          console.log("Merged file successfully uploaded!");
        }
      }

      const propertyRef = doc(db, "property", formData.PropertyID);
      const propSnapshot = await getDoc(propertyRef);
      const propData = propSnapshot.data();

      await setDoc(doc(db, "pending_changes", formData.PropertyID), {
        LocationID: parseInt(formData.LocationID),
        StatusID: parseInt(formData.StatusID),
        TrusteeID: parseInt(formData.TrusteeID),
        isArchived: archiveStat,
        VerNum: newVar,
        CategoryID: propData.CategoryID,
        Documents: propData.Documents,
        PropertyID: parseInt(formData.PropertyID),
        PropertyName: propData.PropertyName,
        PurchaseOrderID: propData.PurchaseOrderID,
        SupplierID: propData.SupplierID,
      });

      const pendRef = doc(db, "pending_changes", formData.PropertyID);
      await updateDoc(pendRef, docUpdate);

      await setDoc(doc(db, "item_document", formData.DocumentID), {
        DateIssued: Timestamp.fromDate(new Date(formData.DateIssued)),
        DocumentID: formData.DocumentID,
        DocumentType: formData.DocumentType,
        IssuedBy: formData.IssuedBy,
        Link: fileUrl,
        ReceivedBy: formData.ReceivedBy,
      });
      alert("Successfully updated property!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating property:", error);
      alert("Failed to update property.");
    }
  };

  const propFieldHasError = (fieldID) => {
    // return helperText when it has error
    if (formErrors[fieldID].length === 0) return;
    return formErrors[fieldID][0];
  };

  return (
    <PaimsForm header="Update a Property in the Database" onSubmit={handleSubmit}>
      <FormSubheadered subheader="Property Details">
        <FormRow segments={3}>
          <SmallTextField
            id="PropertyID"
            label="Property ID"
            value={formData.PropertyID}
            onChange={handleInputChange}
            pattern="[0-9]*"
            title="Numbers only."
            required
            helperText={propertyFound ? "Property found" : propFieldHasError("PropertyID")}
            color={propertyFound ? "success" : propFieldHasError("PropertyID") ? "error" : "primary"}
          />
          <AggregatedFormSelect id={`TrusteeID`} label="Trustee" value={formData.TrusteeID} onChange={handleInputChange} options={users} />
        </FormRow>
        <FormRow segments={3}>
          <AggregatedFormSelect id={`StatusID`} label="Status" value={formData.StatusID} onChange={handleInputChange} options={statuses} />
          <AggregatedFormSelect id={`LocationID`} label="Location" value={formData.LocationID} onChange={handleInputChange} options={locations} />
        </FormRow>
        <FormRow segments={3}>
          <SmallTextField
            id="UnitValue"
            label="Unit Value"
            value={formData.UnitNumber}
            onChange={handleInputChange}
            error={!!propFieldHasError("UnitValue")}
            helperText={propFieldHasError("UnitValue")}
          />
          <AggregatedFormSelect id={`PropertyFound`} label="Is the Property Found?" value={formData[`PropertyFound`]} onChange={handleInputChange} options={isFoundDropdown} />
        </FormRow>
      </FormSubheadered>
      <FormSubheadered subheader="Accompanying Document">
        <FormRow segments={3}>
          <SmallTextField id="DocumentID" label="Document Name" value={formData.DocumentID} onChange={handleInputChange} required />
          <AggregatedFormSelect label="Type" id="DocumentType" value={formData.DocumentType} onChange={handleInputChange} options={types} disabled={docLocked} />
          <FormDatePicker
            id="DateIssued"
            label="Date Issued"
            value={formData.DateIssued}
            onChange={(val) => {
              setFormData({
                ...formData,
                DateIssued: val,
              });
            }}
            disabled={docLocked}
          />
        </FormRow>
        <FormRow segments={3}>
          <AggregatedFormSelect
            label="IssuedBy"
            id="IssuedBy"
            value={formData.IssuedBy}
            onChange={handleInputChange}
            disabled={docLocked}
            options={users}
            error={!!propFieldHasError("IssuedBy")}
            helpertext={propFieldHasError("IssuedBy")} // notice small "T"
          />
          <AggregatedFormSelect
            label="ReceivedBy"
            id="ReceivedBy"
            value={formData.ReceivedBy}
            onChange={handleInputChange}
            disabled={docLocked}
            options={users}
            error={!!propFieldHasError("IssuedBy")}
            helpertext={propFieldHasError("IssuedBy")} // notice small "T"
          />
          <FormFileUpload id="Link" filename={formData.holdLink?.name} onChange={handleFileChange} disabled={docLocked} />
        </FormRow>
      </FormSubheadered>
      <SubmitButton text="Update Property" />
    </PaimsForm>
  );
};

export default UpdateProp;
