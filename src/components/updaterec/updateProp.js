import React, { useEffect, useState } from "react";
import { doc, updateDoc, setDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../firebase-config";
import { fetchDeptLocations, fetchDeptUsers, fetchStatuses, fetchTypes } from "../../fetchutils/fetchdropdowndata";

import { PaimsForm, FormSubheadered, FormRow } from "../paimsform/paimsForm";
import SmallTextField from "../paimsform/smallTextField";
import { AggregatedFormSelect } from "../paimsform/formSelect";
import SubmitButton from "../paimsform/submitButton";
import FormDatePicker from "../paimsform/formDatePicker";
import FormFileUpload from "../paimsform/formFileUpload";
import { autofillDocumentData, autofillPropertyData } from "../../fetchutils/formautofill";

const UpdateProp = () => {
  const [formData, setFormData] = useState({
    StatusID: "",
    TrusteeID: "",
    LocationID: "",
    PropertyID: "",
    parID: {},
    iirupID: {},
    icsID: {},
    SpecDoc: "",
    DocumentType: "",
    DateIssued: null,
    IssuedBy: "",
    Link: "",
    ReceivedBy: "",
  });

  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);
  const [docLocked, setDocLocked] = useState(false);

  useEffect(() => {
    const fetchdropdowndata = async () => {
      setUsers(await fetchDeptUsers());
      setLocations(await fetchDeptLocations());
      setStatuses(await fetchStatuses());
      setTypes(await fetchTypes());
    };

    fetchdropdowndata();
  }, []);

  const handleInputChange = (e) => {
    if (e.target.name !== "") {
      // probably a PointerEvent due to MUI Select
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    } else {
      // regular onChange event
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }

    if (e.target.id === "PropertyID") {
      autofillPropertyData(e.target.value, setFormData);
    }
    if (e.target.id === "SpecDoc") {
      autofillDocumentData(e.target.value, setFormData);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      Link: file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.IssuedBy === formData.ReceivedBy) {
      alert("IssuedBy and ReceivedBy cannot be the same user.");
      return;
    }

    try {
      var iirupUpdate = {};
      var parUpdate = {};
      var icsUpdate = {};
      var newVar = formData.VerNum + 1;
      var archiveStat = 0;
      if (formData.DocumentType === "IIRUP") {
        iirupUpdate[`iirupID.${newVar}`] = formData.SpecDoc;
        archiveStat = 1;
      } else if (formData.DocumentType === "PAR") {
        parUpdate[`parID.${newVar}`] = formData.SpecDoc;
      } else {
        icsUpdate[`icsID.${newVar}`] = formData.SpecDoc;
      }
      const propertyRef = doc(db, "property", formData.PropertyID);
      updateDoc(propertyRef, icsUpdate);
      updateDoc(propertyRef, parUpdate);
      updateDoc(propertyRef, iirupUpdate);

      console.log("Uploading file to Firebase Storage");
      const fileRef = ref(storage, "DCS/" + formData.Link.name);
      await uploadBytes(fileRef, formData.Link);
      const fileUrl = await getDownloadURL(fileRef);
      console.log("File uploaded successfully:", fileUrl);

      await updateDoc(propertyRef, {
        LocationID: parseInt(formData.LocationID),
        StatusID: parseInt(formData.StatusID),
        TrusteeID: parseInt(formData.TrusteeID),
        isArchived: archiveStat,
        VerNum: newVar,
      });

      await setDoc(doc(db, "item_document", formData.SpecDoc), {
        DateIssued: Timestamp.fromDate(new Date(formData.DateIssued)),
        DocumentID: formData.SpecDoc,
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

  return (
    <PaimsForm header="Update a Property in the Database" onSubmit={handleSubmit}>
      <FormSubheadered subheader="Property Details">
        <FormRow segments={3}>
          <SmallTextField id="PropertyID" label="Property ID" value={formData.PropertyID} onChange={handleInputChange} pattern="[0-9]*" title="Numbers only." required />
          <AggregatedFormSelect id={`TrusteeID`} label="Trustee" value={formData.TrusteeID} onChange={handleInputChange} options={users} />
        </FormRow>
        <FormRow segments={3}>
          <AggregatedFormSelect id={`StatusID`} label="Status" value={formData.StatusID} onChange={handleInputChange} options={statuses} />
          <AggregatedFormSelect id={`LocationID`} label="Location" value={formData.LocationID} onChange={handleInputChange} options={locations} />
        </FormRow>
      </FormSubheadered>
      <FormSubheadered subheader="Accompanying Document">
        <FormRow segments={3}>
          <SmallTextField id="SpecDoc" label="Document Name" value={formData.SpecDoc} onChange={handleInputChange} required />
          <AggregatedFormSelect label="Type" id="DocumentType" value={formData.DocumentType} onChange={handleInputChange} options={types} disabled={docLocked} />
          <FormDatePicker
            id="DateIssued"
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
          <AggregatedFormSelect label="IssuedBy" id="IssuedBy" value={formData.IssuedBy} onChange={handleInputChange} disabled={docLocked} options={users} />
          <AggregatedFormSelect label="ReceivedBy" id="ReceivedBy" value={formData.ReceivedBy} onChange={handleInputChange} disabled={docLocked} options={users} />
          <FormFileUpload id="Link" onChange={handleFileChange} disabled={docLocked} />
        </FormRow>
      </FormSubheadered>
      <SubmitButton text="Update Property" />
    </PaimsForm>
  );
};

export default UpdateProp;
