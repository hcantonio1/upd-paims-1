import * as React from "react";
import Layout from "../common/layout";
import { useState, useEffect } from "react";
import { db, storage } from "../../../firebase-config";
import { doc, setDoc, Timestamp, getDoc, collection, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { CloudUpload } from "@material-ui/icons";

import PaimsForm from "../paimsform/paimsForm";
import FormSubheadered from "../paimsform/formSubheadered";
import FormRow from "../paimsform/formRow";
import SmallTextField from "../paimsform/smallTextField";
import { AggregatedFormSelect } from "../paimsform/formSelect";
import SubmitButton from "../paimsform/submitButton";
import FormDatePicker from "../paimsform/formDatePicker";
import FormFileUpload from "../paimsform/formFileUpload";
import { Box } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const InsertRecord = () => {
  const [inputData, setInputData] = useState({
    DocumentID: "",
    DocumentType: "",
    DateIssued: "",
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

    const fetchCategories = async () => {
      try {
        const categoryCollection = collection(db, "item_category");
        const snapshot = await getDocs(categoryCollection);
        const categories = snapshot.docs.map((doc) => doc.data());
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
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
    fetchCategories();
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

  const handleInsertDoc = async (e) => {
    e.preventDefault();

    if (inputData.IssuedBy === inputData.ReceivedBy) {
      alert("IssuedBy and ReceivedBy cannot be the same user.");
      return;
    }

    try {
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
      alert("Successfully inserted!");
      window.location.reload();
    } catch (error) {
      console.error("Error inserting document:", error);
      alert("Failed to insert record.");
    }
  };

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
      fetchDocumentData(e.target.value);
    }
    if (e.target.id === "SupplierID") {
      fetchSupplierData(e.target.value);
    }
    if (e.target.id === "PropertyID") {
      fetchPropertyData(e.target.value);
    }
    //if (e.target.id === "PurchaseOrderID") {
    //  fetchOrderData(e.target.value);
    //}
  };

  const setPurchaseDate = (value, index) => {
    setInputData((prevData) => ({
      ...prevData,
      PurchaseDate: value,
    }));
  };

  const fetchSupplierData = async (supplierId) => {
    try {
      const supRef = doc(db, "supplier", supplierId);
      const supSnap = await getDoc(supRef);

      if (supSnap.exists()) {
        const supData = supSnap.data();
        setSupLocked(true);
        setInputData((prevData) => ({
          ...prevData,
          City: supData.City,
          State: supData.State,
          StreetName: supData.StreetName,
          SupplierContact: supData.SupplierContact,
          SupplierName: supData.SupplierName,
          UnitNumber: parseInt(supData.UnitNumber),
        }));
      }
      if (!supSnap.exists()) {
        setSupLocked(false);
        setInputData((prevData) => ({
          ...prevData,
          City: "",
          State: "",
          StreetName: "",
          SupplierContact: "",
          SupplierName: "",
          UnitNumber: "",
        }));
      }
    } catch (error) {
      console.error("Error fetching supplier:", error);
    }
  };

  {
    /*const fetchOrderData = async (orderId) => {
    try {
      const orderRef = doc(db, "purchase_order", orderId);
      const orderSnap = await getDoc(orderRef);

      if (orderSnap.exists()) {
        const orderData = orderSnap.data();
        console.log(`TotalCost_${index}`);
        setOrderLocked(true);
        setInputData((prevData) => ({
          ...prevData,
          PurchaseDate: orderData.PurchaseDate.toDate()
            .toISOString()
            .split("T")[0],
          SupplierID: parseInt(orderData.SupplierID),
          TotalCost: parseInt(orderData.TotalCost),
        }));
      }
      if (!orderSnap.exists()) {
        setOrderLocked(false);
        setInputData((prevData) => ({
          ...prevData,
          PurchaseDate: "",
          SupplierID: "",
          TotalCost: "",
        }));
      }
    } catch (error) {
      console.error("Error fetching purchase order:", error);
    }
  }; */
  }

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

  const fetchDocumentData = async (documentId) => {
    try {
      const docRef = doc(db, "item_document", documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const docData = docSnap.data();
        setDocLocked(true);
        setInputData((prevData) => ({
          ...prevData,
          DocumentType: docData.DocumentType,
          DateIssued: docData.DateIssued.toDate().toISOString().split("T")[0],
          IssuedBy: docData.IssuedBy,
          ReceivedBy: docData.ReceivedBy,
        }));
      }
      if (!docSnap.exists()) {
        setDocLocked(false);
        setInputData((prevData) => ({
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
        <FormDatePicker id="DateIssued" label="Purchase Date" value={inputData.PurchaseDate} onChange={setPurchaseDate} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <label htmlFor="PurchaseDate" style={{ display: "inline-block", width: "150px", verticalAlign: "top" }}>
            <DatePicker label="Purchase Date" id="PurchaseDate" inputFormat="YYYY-MM-DD" value={inputData.PurchaseDate} onChange={setPurchaseDate} />
          </label>
        </LocalizationProvider>
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
        <FormDatePicker id="DateIssued" value={inputData.DateIssued} onChange={handleInputChange} readOnly={docLocked} />
      </FormRow>
      <FormRow segments={3}>
        <AggregatedFormSelect label="IssuedBy" id="IssuedBy" value={inputData.IssuedBy} onChange={handleInputChange} disabled={docLocked} options={users} optionnamegetter={getFullName} />
        <AggregatedFormSelect label="ReceivedBy" id="ReceivedBy" value={inputData.ReceivedBy} onChange={handleInputChange} disabled={docLocked} options={users} optionnamegetter={getFullName} />
        <FormFileUpload id="Link" onChange={handleFileChange} disabled={docLocked} />
      </FormRow>
    </FormSubheadered>
  );

  return (
    <Layout pageTitle="INSERT">
      <Box sx={{ padding: 2, margin: 1 }}>
        <main>
          <PaimsForm header="Insert a New Record into the Database" onSubmit={handleInsert}>
            {itemSubheadered}
            {poSubheadered}
            {docSubheadered}
            <SubmitButton text="Only Submit Document" onClick={handleInsertDoc} />
            {supplierSubheadered}
            <SubmitButton text="Submit All & Insert Property" />
          </PaimsForm>
        </main>
      </Box>
    </Layout>
  );
};

export const Head = () => <title>Insert Record</title>;

export default InsertRecord;
