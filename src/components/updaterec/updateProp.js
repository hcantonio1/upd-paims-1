import React, { useEffect, useState } from "react";
import { doc, updateDoc, setDoc, Timestamp, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../../../firebase-config";
import { fetchDeptLocations, fetchDeptUsers, fetchStatuses, fetchTypes } from "../../fetchutils/fetchdropdowndata";

import { PaimsForm, FormSubheadered, FormRow } from "../paimsform/paimsForm";
import SmallTextField from "../paimsform/smallTextField";
import { AggregatedFormSelect } from "../paimsform/formSelect";
import SubmitButton from "../paimsform/submitButton";
import FormDatePicker from "../paimsform/formDatePicker";
import { FormFileUpload } from "../paimsform/formFileUpload";
import { autofillDocumentData, autofillPropertyData } from "../../fetchutils/formautofill";

import { PDFDocument } from 'pdf-lib'

function nextChar(c) {
  return String.fromCharCode(c.charCodeAt(0) + 1);
}

async function copyPages(url1, url2) {
  const firstDonorPdfBytes = await fetch(url1).then(res => res.arrayBuffer())
  const secondDonorPdfBytes = await fetch(url2).then(res => res.arrayBuffer())

  const mergedPdf = await PDFDocument.create();

  const pdfA = await PDFDocument.load(firstDonorPdfBytes)
  const pdfB = await PDFDocument.load(secondDonorPdfBytes)

  const copiedPagesA = await mergedPdf.copyPages(pdfA, pdfA.getPageIndices());
  copiedPagesA.forEach((page) => mergedPdf.addPage(page));

  const copiedPagesB = await mergedPdf.copyPages(pdfB, pdfB.getPageIndices());
  copiedPagesB.forEach((page) => mergedPdf.addPage(page));

  const mergedPdfFile = await mergedPdf.save();
  return mergedPdfFile;
}

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
    // MUI Select sends an object target={name, value} as opposed to regular onChange which sends a target=HTML
    const formDataKey = e.target.name !== "" ? e.target.name : e.target.id;
    setFormData({ ...formData, [formDataKey]: e.target.value });

    if (formDataKey === "PropertyID") {
      autofillPropertyData(e.target.value, setFormData);
    }
    if (formDataKey === "SpecDoc") {
      autofillDocumentData(e.target.value, setFormData);
    }
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
      docUpdate[`Documents.${newVar}`] = formData.SpecDoc;
      var archiveStat = 0;
      if (formData.DocumentType === "IIRUP") {
        archiveStat = 1;
      }
      const propertyRef = doc(db, "property", formData.PropertyID);
      await updateDoc(propertyRef, docUpdate);

      console.log("Uploading file to Firebase Storage");
      const fileRef = ref(storage, "DCS/" + formData.holdLink.name);
      await uploadBytes(fileRef, formData.holdLink);
      var fileUrl = await getDownloadURL(fileRef);
      console.log("Temp File uploaded successfully:", fileUrl);

      if (formData.holdLink.name === undefined) {
        fileUrl = formData.Link;
      } else {
        const prevDoc = (formData.Documents)[formData.VerNum];
        const prevDocRef = doc(db, "item_document", prevDoc);
        const prevDocSnap = await getDoc(prevDocRef);
        console.log("hi3");
        if (prevDocSnap.exists()) {
          const prevDocData = prevDocSnap.data();
          const oldLink = prevDocData.Link;
          console.log("oldlink:", oldLink);
          const combinedPdfs = await copyPages(oldLink, fileUrl);
          console.log("hi4");
          console.log(combinedPdfs);
        
          deleteObject(fileRef).then(() => {
            console.log("File deleted successfully!");
          }).catch((error) => {
            console.log("Error deleting file!");
          });
        
          console.log("Uploading merged file to Firebase Storage");
          const newFileRef = ref(storage, "DCS/" + formData.holdLink.name);
          await uploadBytes(newFileRef, combinedPdfs);
          fileUrl = await getDownloadURL(newFileRef);
          console.log("Merged file successfully uploaded!");
        }
      }

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
          <AggregatedFormSelect label="IssuedBy" id="IssuedBy" value={formData.IssuedBy} onChange={handleInputChange} disabled={docLocked} options={users} />
          <AggregatedFormSelect label="ReceivedBy" id="ReceivedBy" value={formData.ReceivedBy} onChange={handleInputChange} disabled={docLocked} options={users} />
          <FormFileUpload id="Link" filename={formData.holdLink?.name} onChange={handleFileChange} disabled={docLocked} />
        </FormRow>
      </FormSubheadered>
      <SubmitButton text="Update Property" />
    </PaimsForm>
  );
};

export default UpdateProp;
