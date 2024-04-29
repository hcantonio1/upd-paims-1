import * as React from "react";
import { useState, useEffect } from "react";
import { db, storage } from "../../../firebase-config";
import { doc, setDoc, Timestamp, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import Layout from "../common/layout";
import PaimsForm from "../paimsform/paimsForm";
import FormSubheadered from "../paimsform/formSubheadered";
import FormRow from "../paimsform/formRow";
import SmallTextField from "../paimsform/smallTextField";
import { AggregatedFormSelect } from "../paimsform/formSelect";
import SubmitButton from "../paimsform/submitButton";
import FormDatePicker from "../paimsform/formDatePicker";
import FormFileUpload from "../paimsform/formFileUpload";

import { autoFillDocumentData, autoFillSupplierData } from "./formautofill";
import { fetchDeptUsers, fetchCategories, fetchStatuses, fetchDeptLocations, fetchTypes } from "./fetchdropdowndata";
import { handleInsertDoc } from "./handleInsertDoc";

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

  const [itemDetailsCount, setItemDetailsCount] = useState([1]);

  const handleAddItem = () => {
    setItemDetailsCount([...itemDetailsCount, 1]);
  };

  const handleRemoveItem = () => {
    const newArray = itemDetailsCount.slice(0, -1);
    setItemDetailsCount(newArray);
  };

  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);
  const [supLocked, setSupLocked] = useState(false);
  const [docLocked, setDocLocked] = useState(false);
  const [orderLocked, setOrderLocked] = useState(false);

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

  const getFullName = (user) => {
    return `${user.FirstName} ${user.LastName}`;
  };

  const getFullLoc = (location) => {
    return `${location.Building} ${location.RoomNumber}`;
  };

  const handleInsert = async (e) => {
    e.preventDefault();

    if (inputData.IssuedBy === inputData.ReceivedBy) {
      alert("IssuedBy and ReceivedBy cannot be the same user.");
      return;
    }

    try {
      await Promise.all(
        itemDetailsCount.map(async (_, index) => {
          const itemData = {
            ...inputData,
            // Update property values based on the index
            PropertyID: inputData[`PropertyID_${index}`],
            PropertyName: inputData[`PropertyName_${index}`],
            TrusteeID: inputData[`TrusteeID_${index}`],
            CategoryID: inputData[`CategoryID_${index}`],
            StatusID: inputData[`StatusID_${index}`],
            LocationID: inputData[`LocationID_${index}`],
            PurchaseOrderID: inputData[`PurchaseOrderID_${index}`],
            TotalCost: inputData[`TotalCost_${index}`],
            PurchaseDate: inputData[`PurchaseDate_${index}`],
          };
          if (itemData.DocumentType === "ICS" && parseInt(itemData.TotalCost) > 49999) {
            alert("ICS cannot have total cost over PHP49,999.");
            return;
          }
          if (itemData.DocumentType === "PAR" && parseInt(itemData.TotalCost) < 50000) {
            alert("PAR cannot have total cost below PHP50,000.");
            return;
          }
          await setDoc(doc(db, "supplier", inputData.SupplierID), {
            City: inputData.City,
            State: inputData.State,
            StreetName: inputData.StreetName,
            SupplierContact: inputData.SupplierContact.toString(),
            SupplierID: parseInt(inputData.SupplierID),
            SupplierName: inputData.SupplierName,
            UnitNumber: parseInt(inputData.UnitNumber),
          });
          console.log("Inserted to supplier!");
          console.log("Uploading file to Firebase Storage");
          const fileRef = ref(storage, "DCS/" + inputData.Link.name);
          await uploadBytes(fileRef, inputData.Link);
          const fileUrl = await getDownloadURL(fileRef);
          console.log("File uploaded successfully:", fileUrl);
          await setDoc(doc(db, "item_document", inputData.DocumentID), {
            DateIssued: Timestamp.fromDate(new Date(inputData.DateIssued)),
            DocumentID: inputData.DocumentID,
            DocumentType: inputData.DocumentType,
            IssuedBy: inputData.IssuedBy,
            Link: fileUrl,
            ReceivedBy: inputData.ReceivedBy,
          });
          var parObject = {};
          var icsObject = {};
          var iirupObject = {};
          var archiveStat = 0;
          if (inputData.DocumentType === "IIRUP") {
            iirupObject[1] = inputData.DocumentID;
            archiveStat = 1;
          } else if (inputData.DocumentType === "PAR") {
            parObject[1] = inputData.DocumentID;
          } else {
            icsObject[1] = inputData.DocumentID;
          }
          await setDoc(doc(db, "property", itemData.PropertyID), {
            CategoryID: parseInt(itemData.CategoryID),
            parID: parObject,
            iirupID: iirupObject,
            icsID: icsObject,
            isArchived: archiveStat,
            isApproved: 0,
            LocationID: parseInt(itemData.LocationID),
            PropertyID: parseInt(itemData.PropertyID),
            PropertyName: itemData.PropertyName,
            TrusteeID: parseInt(itemData.TrusteeID),
            StatusID: parseInt(itemData.StatusID),
            SupplierID: parseInt(itemData.SupplierID),
            PurchaseOrderID: parseInt(itemData.PurchaseOrderID),
            VerNum: 1,
          });
          console.log("Inserted to property!");
          console.log("PurchaseDate:", itemData.PurchaseDate);
          console.log("DateIssued:", Timestamp.fromDate(new Date(itemData.DateIssued)));
          await setDoc(doc(db, "purchase_order", itemData.PurchaseOrderID), {
            PurchaseDate: Timestamp.fromDate(new Date(itemData.PurchaseDate)),
            PurchaseOrderID: parseInt(itemData.PurchaseOrderID),
            SupplierID: parseInt(itemData.SupplierID),
            TotalCost: parseInt(itemData.TotalCost),
          });
          console.log("Inserted to purchase_order!");
          alert("Successfully inserted!");
          window.location.reload();
        })
      );
    } catch (error) {
      console.error("Error inserting document:", error);
      alert("Failed to insert record.");
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (e.target.name === "DocumentID") {
      autoFillDocumentData(e.target.value, setDocLocked, setInputData);
    }
    if (e.target.name === "SupplierID") {
      autoFillSupplierData(e.target.value, setSupLocked, setInputData);
    }
    if (e.target.name === `PropertyID_${index}`) {
      fetchPropertyData(e.target.value);
    }
    //if (e.target.name === `PurchaseOrderID_${index}`) {
    //  fetchOrderData(e.target.value);
    //}
  };

  const setPurchaseDate = (value, index) => {
    setInputData((prevData) => ({
      ...prevData,
      [`PurchaseDate_${index}`]: value,
    }));
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
        <SmallTextField id="PropertyID" label="Property ID" value={inputData.PropertyID} onChange={handleInputChange} pattern="[0-9]*" title="Numbers only." required />
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
        <FormDatePicker label="Purchase Date" id="PurchaseDate" value={inputData.PurchaseDate} onChange={setPurchaseDate} />
      </FormRow>
    </FormSubheadered>
  );
  const supplierSubheadered = (
    <FormSubheadered subheader="Supplier Details">
      <FormRow segments={3}>
        <SmallTextField id="SupplierID" label="Supplier ID" value={inputData.SupplierID} onChange={handleInputChange} pattern="[0-9]*" title="Numbers only." required />
        <SmallTextField id="SupplierName" label="Supplier Name" value={inputData.SupplierName} onChange={handleInputChange} required />
        <SmallTextField id="SupplierContact" label="Contact Number" value={inputData.SupplierContact} onChange={handleInputChange} required />
      </FormRow>
      <FormRow segments={4}>
        <SmallTextField id="UnitNumber" label="Unit Number" value={inputData.UnitNumber} onChange={handleInputChange} />
        <SmallTextField id="StreetName" label="Street Name" value={inputData.StreetName} onChange={handleInputChange} />
        <SmallTextField id="City" label="City" value={inputData.City} onChange={handleInputChange} />
        <SmallTextField id="State" label="State" value={inputData.State} onChange={handleInputChange} />
      </FormRow>
    </FormSubheadered>
  );

  const docSubheadered = (
    <FormSubheadered subheader="Document Details">
      <FormRow segments={3}>
        <SmallTextField id="DocumentID" label="Document Name" value={inputData.DocumentID} onChange={handleInputChange} required />
        <AggregatedFormSelect label="Type" id="DocumentType" value={inputData.DocumentType} onChange={handleInputChange} options={types} required />
        <FormDatePicker id="DateIssued" label="Date Issued" value={inputData.DateIssued} onChange={handleInputChange} readOnly={docLocked} />
      </FormRow>
      <FormRow segments={3}>
        <AggregatedFormSelect label="IssuedBy" id="IssuedBy" value={inputData.IssuedBy} onChange={handleInputChange} disabled={docLocked} options={users} optionnamegetter={getFullName} />
        <AggregatedFormSelect label="ReceivedBy" id="ReceivedBy" value={inputData.ReceivedBy} onChange={handleInputChange} disabled={docLocked} options={users} optionnamegetter={getFullName} />
        <FormFileUpload id="Link" onChange={handleFileChange} disabled={docLocked} />
      </FormRow>
    </FormSubheadered>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Layout pageTitle="INSERT">
        <Box sx={{ padding: 2, margin: 1 }}>
          <main>
            <PaimsForm header="Insert a New Record into the Database" onSubmit={handleInsert}>
              {itemSubheadered}
              {poSubheadered}
              {docSubheadered}
              <SubmitButton
                text="Only Submit Document"
                onClick={(e) => {
                  handleInsertDoc(e, inputData);
                }}
              />
              {supplierSubheadered}
              <SubmitButton text="Submit All & Insert Property" />
            </PaimsForm>
          </main>
        </Box>
      </Layout>
    </LocalizationProvider>
  );
};

export const Head = () => <title>Insert Record</title>;

export default InsertRecord;
