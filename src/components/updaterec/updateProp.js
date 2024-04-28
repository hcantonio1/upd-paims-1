import React, { useEffect, useState } from "react";
import { doc, updateDoc, getDoc, getDocs, collection, setDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../firebase-config";

import PaimsForm from "../paimsform/PaimsForm";
import FormSubheadered from "../paimsform/FormSubheadered";
import FormRow from "../paimsform/FormRow";
import SmallTextField from "../paimsform/SmallTextField";
import FormSelect from "../paimsform/FormSelect";
import SubmitButton from "../paimsform/SubmitButton";
import FormDatePicker from "../paimsform/FormDatePicker";
import FormFileUpload from "../paimsform/FormFileUpload";

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
    DateIssued: "",
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
    const fetchUsers = async () => {
      try {
        const userCollection = collection(db, "user");
        const snapshot = await getDocs(userCollection);
        const users = snapshot.docs.map((doc) => doc.data());
        setUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchLocations = async () => {
      try {
        const locationCollection = collection(db, "item_location");
        const snapshot = await getDocs(locationCollection);
        const locations = snapshot.docs.map((doc) => doc.data());
        setLocations(locations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    const fetchStatuses = async () => {
      try {
        const statusCollection = collection(db, "status");
        const snapshot = await getDocs(statusCollection);
        const statuses = snapshot.docs.map((doc) => doc.data());
        setStatuses(statuses);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };
    const fetchTypes = async () => {
      try {
        const typeCollection = collection(db, "doctype");
        const snapshot = await getDocs(typeCollection);
        const types = snapshot.docs.map((doc) => doc.data());
        setTypes(types);
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };

    fetchUsers();
    fetchLocations();
    fetchStatuses();
    fetchTypes();
  }, []);

  const getFullName = (user) => {
    return `${user.FirstName} ${user.LastName}`;
  };

  const getFullLoc = (location) => {
    return `${location.Building} ${location.RoomNumber}`;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    if (e.target.id === "PropertyID") {
      fetchPropData(e.target.value);
    }
    if (e.target.id === "SpecDoc") {
      fetchDocumentData(e.target.value);
    }
  };

  const fetchPropData = async (propID) => {
    try {
      const propRef = doc(db, "property", propID);
      const propSnap = await getDoc(propRef);
      if (propSnap.exists()) {
        const propData = propSnap.data();
        setFormData((prevData) => ({
          ...prevData,
          LocationID: parseInt(propData.LocationID),
          StatusID: parseInt(propData.StatusID),
          TrusteeID: parseInt(propData.TrusteeID),
          VerNum: propData.VerNum,
        }));
      }
      if (!propSnap.exists()) {
        setFormData((prevData) => ({
          ...prevData,
          LocationID: "",
          StatusID: "",
          TrusteeID: "",
          VerNum: "",
        }));
      }
    } catch (error) {
      console.error("Error fetching property:", error);
    }
  };

  const fetchDocumentData = async (documentId) => {
    try {
      const docRef = doc(db, "item_document", documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const docData = docSnap.data();
        console.log(docData.ReceivedBy);
        setDocLocked(true);
        setFormData((prevData) => ({
          ...prevData,
          DocumentType: docData.DocumentType,
          DateIssued: docData.DateIssued.toDate().toISOString().split("T")[0],
          IssuedBy: docData.IssuedBy,
          ReceivedBy: docData.ReceivedBy,
        }));
      }
      if (!docSnap.exists()) {
        setDocLocked(false);
        setFormData((prevData) => ({
          ...prevData,
          DocumentType: "",
          DateIssued: "",
          IssuedBy: "",
          ReceivedBy: "",
        }));
      }
    } catch (error) {
      console.error("Error fetching document:", error);
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
        <FormRow segments={3} test="Hello from updateProp">
          <SmallTextField id="PropertyID" label="Property ID" value={formData.PropertyID} onChange={handleInputChange} pattern="[0-9]*" title="Numbers only." required />
          <FormSelect
            label="Trustee"
            id="TrusteeID"
            value={formData.TrusteeID}
            onChange={(e) => {
              setFormData({ ...formData, TrusteeID: e.target.value });
            }}
            choiceValuePairs={users.map((user) => [getFullName(user), user.UserID])}
          />
        </FormRow>
        <FormRow segments={3}>
          <FormSelect
            label="Status"
            id="StatusID"
            value={formData.StatusID}
            onChange={(e) => {
              setFormData({ ...formData, StatusID: e.target.value });
            }}
            choiceValuePairs={statuses.map((status) => [status.StatusName, status.StatusID])}
          />
          <FormSelect
            label="Location"
            id="LocationID"
            value={formData.LocationID}
            onChange={(e) => {
              setFormData({ ...formData, LocationID: e.target.value });
            }}
            choiceValuePairs={locations.map((loc) => [getFullLoc(loc), loc.LocationID])}
          />
        </FormRow>
      </FormSubheadered>
      <FormSubheadered subheader="Accompanying Document">
        <FormRow segments={3}>
          <SmallTextField id="SpecDoc" label="Document Name" value={formData.SpecDoc} onChange={handleInputChange} required />
          <FormSelect
            label="Type"
            id="DocumentType"
            value={formData.DocumentType}
            onChange={(e) => {
              setFormData({ ...formData, DocumentType: e.target.value });
            }}
            disabled={docLocked}
            choiceValuePairs={types.map((type) => [type.Type, type.Type])}
          />
          <FormDatePicker id="DateIssued" value={formData.DateIssued} onChange={handleInputChange} disabled={docLocked} />
        </FormRow>
        <FormRow segments={3}>
          <FormSelect
            label="IssuedBy"
            id="IssuedBy"
            value={formData.IssuedBy}
            onChange={(e) => {
              setFormData({ ...formData, IssuedBy: e.target.value });
            }}
            disabled={docLocked}
            choiceValuePairs={users.map((user) => [getFullName(user), user.Username])}
          />
          <FormSelect
            label="ReceivedBy"
            id="ReceivedBy"
            value={formData.ReceivedBy}
            onChange={(e) => {
              setFormData({ ...formData, ReceivedBy: e.target.value });
            }}
            disabled={docLocked}
            choiceValuePairs={users.map((user) => [getFullName(user), user.Username])}
          />
          <FormFileUpload id="Link" onChange={handleFileChange} disabled={docLocked} />
        </FormRow>
      </FormSubheadered>
      <SubmitButton text="Update Property" />
    </PaimsForm>
  );
};

export default UpdateProp;
