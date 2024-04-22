// Step 1: Import React
import * as React from "react";
// import { Link } from "gatsby";
import Layout from "../layout";
import { useState, useEffect } from "react";
import { db, storage } from "../../../firebase-config";
import {
  doc,
  setDoc,
  Timestamp,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { makeStyles } from "@material-ui/core";
import { Typography, Divider, Box, Button, Stack, TextField } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SelectTextField from "../selectTextField"


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
    PurchaseDate: "",
    PurchaseOrderID: "",
    TotalCost: "",
    City: "",
    State: "",
    StreetName: "",
    SupplierContact: "",
    SupplierName: "",
    UnitNumber: "",
  });

  const [itemDetailsCount, setItemDetailsCount] = useState([
    1
  ])

  const handleAddItem = () => {
    setItemDetailsCount([...itemDetailsCount, 1])
  }

  const handleRemoveItem = () => {
    const newArray = itemDetailsCount.slice(0, -1);
    setItemDetailsCount(newArray);
  }

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
      await Promise.all(itemDetailsCount.map(async (_, index) => {
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
        if (itemData.DocumentType === "ICS" && itemData.TotalCost > 49999) {
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
        console.log("PurchaseDate:", Timestamp.fromDate(new Date(itemData.PurchaseDate)));
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
      }));
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
    const { name, value } = e.target;
    setInputData(prevData => ({
      ...prevData,
      [name]: value
    }));

    if (e.target.name === "DocumentID") {
      fetchDocumentData(e.target.value);
    }
    if (e.target.name === "SupplierID") {
      fetchSupplierData(e.target.value);
    }
    if (e.target.name === "PropertyID") {
      fetchPropertyData(e.target.value);
    }
    if (e.target.name === "PurchaseOrderID") {
      fetchOrderData(e.target.value);
    }
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

  const fetchOrderData = async (orderId) => {
    try {
      const orderRef = doc(db, "purchase_order", orderId);
      const orderSnap = await getDoc(orderRef);

      if (orderSnap.exists()) {
        const orderData = orderSnap.data();
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
  };

  const fetchPropertyData = async (propId) => {
    try {
      const propRef = doc(db, "property", propId);
      const propSnap = await getDoc(propRef);

      if (propSnap.exists()) {
        alert("A property with this ID already exists!");
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

  const useStyles = makeStyles({
    root: {
      padding: 20,
      margin: 5,
    },

    addRecordTextContainer: {
      backgroundColor: "#e5e5e5",
      padding: 10,
    },

    addRecordFields: {
      borderStyle: "solid",
      borderColor: "#e5e5e5",
      padding: 10,
      mr: 150,
    },
  });

  const classes = useStyles();

  return (
    <Layout pageTitle="INSERT">
      <Box display="flex" flexDirection="column" className={classes.root}>
        <main>

          <Box display="flex" flexDirection="column">
            <Box className={classes.addRecordTextContainer}>
              <Typography variant="h9" fontWeight={"bold"}>
                Insert a New Record into the Database
              </Typography>
            </Box>

            <form onSubmit={handleInsert}>
              <Box sx={{ pt: 3, pb: 3 }} className={classes.addRecordFields}>
                <Typography variant="h9" fontWeight={"bold"}>
                  Item Details
                </Typography>
                <Divider />

                {itemDetailsCount.map((_, index) => (
                  <>
                    <Stack
                      // key={index}
                      padding={1}
                      spacing={2}
                      mt={2}
                      direction="row"
                      justifyContent="space-between"
                    >
                      {/* FIELDS: PropertyID, PropertyName, Trustee */}
                      <Stack item>
                        <label
                          htmlFor={`PropertyID_${index}`}
                          style={{
                            display: "inline-block",
                            width: "150px",
                            verticalAlign: "top",
                          }}
                        />

                        <TextField
                          label="Property ID"
                          variant="outlined"
                          name={`PropertyID_${index}`}
                          value={inputData[`PropertyID_${index}`]}
                          onChange={(e) => handleInputChange(e, index)}
                          required
                          sx={{ width: 300 }}
                          pattern="[0-9]*"
                          title="Numbers only."
                        />
                      </Stack>

                      <Stack item>
                        <label
                          htmlFor={`PropertyName_${index}`}
                          style={{
                            display: "inline-block",
                            width: "150px",
                            verticalAlign: "top",
                          }}
                        />
                        <TextField
                          label="Property Name"
                          variant="outlined"
                          name={`PropertyName_${index}`}
                          value={inputData[`PropertyName_${index}`]}
                          onChange={(e) => handleInputChange(e, index)}
                          required
                          sx={{ width: 300 }}
                        />
                      </Stack>
                      <Stack item>
                        <label
                          htmlFor={`TrusteeID_${index}`}
                          style={{ display: "inline-block", verticalAlign: "top" }}
                        />
                        <SelectTextField
                          label="Select Trustee"
                          name={`TrusteeID_${index}`}
                          value={inputData[`TrusteeID_${index}`]}
                          onChange={(e) => handleInputChange(e, index)}
                          options={users}
                          getFunc={getFullName}
                        />
                      </Stack>
                    </Stack>

                    {/* FIELDS: Category, Status, Location */}
                    <Stack
                      padding={1}
                      spacing={2}
                      // mt={1}
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Stack item>
                        <label
                          htmlFor={`CategoryID_${index}`}
                          style={{
                            display: "inline-block",
                            width: "150px",
                            verticalAlign: "top",
                          }}
                        />

                        <SelectTextField
                          label="Select Category"
                          name={`CategoryID_${index}`}
                          value={inputData[`CategoryID_${index}`]}
                          onChange={(e) => handleInputChange(e, index)}
                          options={categories}
                        />
                      </Stack>
                      <Stack item>
                        <label
                          htmlFor={`StatusID_${index}`}
                          style={{
                            display: "inline-block",
                            width: "150px",
                            verticalAlign: "top",
                          }}
                        />

                        <SelectTextField
                          label="Select Status"
                          name={`StatusID_${index}`}
                          value={inputData[`StatusID_${index}`]}
                          onChange={(e) => handleInputChange(e, index)}
                          options={statuses}
                        />
                      </Stack>
                      <Stack item>
                        <label
                          htmlFor={`LocationID_${index}`}
                          style={{
                            display: "inline-block",
                            width: "150px",
                            verticalAlign: "top",
                          }}
                        />

                        <SelectTextField
                          label="Select Location"
                          name={`LocationID_${index}`}
                          value={inputData[`LocationID_${index}`]}
                          onChange={(e) => handleInputChange(e, index)}
                          options={locations}
                          getFunc={getFullLoc}
                        />
                      </Stack>
                    </Stack>

                    {/* FIELDS: PurchaseID, PurchaseDate, Cost */}
                    <Stack
                      padding={1}
                      spacing={2}
                      mb={3}
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Stack item>
                        <label
                          htmlFor={`PurchaseOrderID_${index}`}
                          style={{
                            display: "inline-block",
                            width: "200px",
                            verticalAlign: "top",
                          }}
                        />

                        <TextField
                          label="Purchase Order ID"
                          variant="outlined"
                          name={`PurchaseOrderID_${index}`}
                          value={inputData[`PurchaseOrderID_${index}`]}
                          onChange={(e) => handleInputChange(e, index)}
                          pattern="[0-9]*"
                          title="Numbers only."
                          required
                          sx={{ width: 300 }}
                        />
                      </Stack>
                      <Stack item>
                        <label
                          htmlFor={`TotalCost_${index}`}
                          style={{
                            display: "inline-block",
                            width: "150px",
                            verticalAlign: "top",
                          }}
                        />
                        <TextField
                          label="Total Cost"
                          variant="outlined"
                          name={`TotalCost_${index}`}
                          value={inputData[`TotalCost_${index}`]}
                          onChange={(e) => handleInputChange(e, index)}
                          pattern="^\d*\.?\d+$"
                          title="Please enter a positive number."
                          required
                          sx={{ width: 300 }}
                          readOnly={orderLocked}
                        />
                      </Stack>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack item>
                          <label
                            htmlFor={`PurchaseDate_${index}`}
                            style={{
                              display: "inline-block",
                              width: "150px",
                              verticalAlign: "top",
                            }}
                          />
                          {/* <input
                          type="date"
                          name={`PurchaseDate_${index}`}
                          value={inputData[`PurchaseDate_${index}`]}
                          onChange={(e) => handleInputChange(e, index)}
                          style={{ width: "250px", display: "inline-block" }}
                          required
                          readOnly={orderLocked}
                        /> */}
                          <DatePicker
                            label="Purchase Date"
                            name={`PurchaseDate_${index}`}
                            value={inputData[`PurchaseDate_${index}`]}
                            onChange={(e) => handleInputChange(e, index)}
                            sx={{width: 300}}
                          />
                        </Stack>
                      </LocalizationProvider>
                    </Stack>
                  </>
                ))}

                <Box
                  display="flex"
                  justifyContent="flex-end"
                >
                  {itemDetailsCount.length > 1 && (
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: '#014421', m: 1 }}
                      onClick={handleRemoveItem}
                    >
                      Remove Item
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: '#014421', m: 1 }}
                    onClick={handleAddItem}
                  >
                    Add Item
                  </Button>
                </Box>

                <Typography variant="h9" fontWeight={"bold"}>
                  Document Details
                </Typography>
                <Divider></Divider>

                {/* FIELDS: DocuType, DocuName, File*/}
                <Stack
                  padding={1}
                  spacing={2}
                  mt={2}
                  direction="row"
                  justifyContent="space-between"
                >
                  <Stack item>
                    <label
                      htmlFor="DocumentID"
                      style={{
                        display: "inline-block",
                        width: "200px",
                        verticalAlign: "top",
                      }}
                    >
                      Document Name<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                    <input
                      type="text"
                      name="DocumentID"
                      value={inputData.DocumentID}
                      onChange={handleInputChange}
                      style={{ width: "300px", display: "inline-block" }}
                      required
                    />
                  </Stack>
                  <Stack item>
                    <label
                      htmlFor="DocumentType"
                      style={{ display: "inline-block", width: "200px", verticalAlign: "top" }}
                    >
                      Document Type<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                    <select
                      name="DocumentType"
                      value={inputData.DocumentType}
                      onChange={handleInputChange}
                      style={{ width: "300px", display: "inline-block" }}
                      required
                    >
                      <option value="">Select Document Type</option>
                      {types.map((type, index) => (
                        <option
                          key={`Type_${index}`}
                          value={type.Type}
                        >
                          {type.Type}
                        </option>
                      ))}
                    </select>
                  </Stack>
                  <Stack item>
                    <label
                      htmlFor="Link"
                      style={{
                        display: "inline-block",
                        width: "150px",
                        verticalAlign: "top",
                      }}
                    >
                      File<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                    <input
                      type="file"
                      name="Link"
                      onChange={handleFileChange}
                      style={{ width: "250px", display: "inline-block" }}
                      required
                      disabled={docLocked}
                    />
                  </Stack>
                </Stack>

                {/* FIELDS: Issued, Receive, Date */}
                <Stack
                  padding={1}
                  spacing={2}
                  mb={3}
                  direction="row"
                  justifyContent="space-between"
                >
                  <Stack item>
                    <label
                      htmlFor="IssuedBy"
                      style={{
                        display: "inline-block",
                        width: "150px",
                        verticalAlign: "top",
                      }}
                    >
                      Issued By<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                    <select
                      name="IssuedBy"
                      value={inputData.IssuedBy}
                      onChange={handleInputChange}
                      style={{ width: "300px", display: "inline-block" }}
                      required
                      disabled={docLocked}
                    >
                      <option value="">Select Issued By</option>
                      {users.map((user, index) => (
                        <option key={user.Username} value={user.Username}>
                          {getFullName(user)}
                        </option>
                      ))}
                    </select>
                  </Stack>
                  <Stack item>
                    <label
                      htmlFor="ReceivedBy"
                      style={{
                        display: "inline-block",
                        width: "150px",
                        verticalAlign: "top",
                      }}
                    >
                      Received By<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                    <select
                      name="ReceivedBy"
                      value={inputData.ReceivedBy}
                      onChange={handleInputChange}
                      style={{ width: "300px", display: "inline-block" }}
                      required
                      disabled={docLocked}
                    >
                      <option value="">Select Received By</option>
                      {users.map((user, index) => (
                        <option key={user.Username} value={user.Username}>
                          {getFullName(user)}
                        </option>
                      ))}
                    </select>
                  </Stack>
                  <Stack item>
                    <label
                      htmlFor="DateIssued"
                      style={{
                        display: "inline-block",
                        width: "150px",
                        verticalAlign: "top",
                      }}
                    >
                      Date Issued<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                    <input
                      type="date"
                      name="DateIssued"
                      value={inputData.DateIssued}
                      onChange={handleInputChange}
                      style={{ width: "250px", display: "inline-block" }}
                      required
                      readOnly={docLocked}
                    />
                  </Stack>
                </Stack>

                <Stack
                  padding={1}
                  direction="row"
                  alignItems="flex-start"
                  justifyContent="flex-end"
                >
                  <Stack item>
                    <Button
                      type="submit"
                      variant="contained"
                      size="small"
                      color="success"
                      onClick={handleInsertDoc}
                    >
                      Submit Document
                    </Button>
                  </Stack>
                </Stack>

                <Typography variant="h9" fontWeight={"bold"}>
                  Supplier Details
                </Typography>
                <Divider></Divider>

                {/* FIELDS: SupplierID, SupplierName */}
                <Stack
                  padding={1}
                  spacing={2}
                  mt={2}
                  direction="row"
                  justifyContent="space-between"
                >
                  <Stack item>
                    <label
                      htmlFor="SupplierID"
                      style={{
                        display: "inline-block",
                        width: "150px",
                        verticalAlign: "top",
                      }}
                    >
                      Supplier ID<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                    <input
                      type="text"
                      name="SupplierID"
                      value={inputData.SupplierID}
                      onChange={handleInputChange}
                      style={{ width: "300px", display: "inline-block" }}
                      pattern="[0-9]*"
                      title="Numbers only."
                      required
                    />
                  </Stack>
                  <Stack item>
                    <label
                      htmlFor="SupplierName"
                      style={{
                        display: "inline-block",
                        width: "150px",
                        verticalAlign: "top",
                      }}
                    >
                      Supplier Name{" "}
                    </label>
                    <input
                      type="text"
                      name="SupplierName"
                      value={inputData.SupplierName}
                      onChange={handleInputChange}
                      style={{ width: "300px", display: "inline-block" }}
                      readOnly={supLocked}
                    />
                  </Stack>
                  <Stack item>
                    <label
                      htmlFor="SupplierContact"
                      style={{
                        display: "inline-block",
                        width: "200px",
                        verticalAlign: "top",
                      }}
                    >
                      Supplier Contact{" "}
                    </label>
                    <input
                      type="text"
                      name="SupplierContact"
                      value={inputData.SupplierContact}
                      onChange={handleInputChange}
                      style={{ width: "250px", display: "inline-block" }}
                      pattern="[0-9]*"
                      title="Numbers only."
                      readOnly={supLocked}
                    />
                  </Stack>
                </Stack>

                {/* FIELDS: Unit, Street, City, State */}
                <Stack
                  padding={1}
                  spacing={2}
                  mb={1}
                  direction="row"
                  justifyContent="space-between"
                >
                  <Stack item>
                    <label
                      htmlFor="UnitNumber"
                      style={{
                        display: "inline-block",
                        width: "120px",
                        verticalAlign: "top",
                      }}
                    >
                      Unit Number
                    </label>
                    <input
                      type="text"
                      name="UnitNumber"
                      value={inputData.UnitNumber}
                      onChange={handleInputChange}
                      style={{ width: "110px", display: "inline-block" }}
                      pattern="[0-9]*"
                      title="Numbers only."
                      readOnly={supLocked}
                    />
                  </Stack>
                  <Stack item>
                    <label
                      htmlFor="StreetName"
                      style={{
                        display: "inline-block",
                        width: "150px",
                        verticalAlign: "top",
                      }}
                    >
                      Street Name{" "}
                    </label>
                    <input
                      type="text"
                      name="StreetName"
                      value={inputData.StreetName}
                      onChange={handleInputChange}
                      style={{ width: "300px", display: "inline-block" }}
                      readOnly={supLocked}
                    />
                  </Stack>
                  <Stack item>
                    <label
                      htmlFor="City"
                      style={{
                        display: "inline-block",
                        width: "150px",
                        verticalAlign: "top",
                      }}
                    >
                      City{" "}
                    </label>
                    <input
                      type="text"
                      name="City"
                      value={inputData.City}
                      onChange={handleInputChange}
                      style={{ width: "290px", display: "inline-block" }}
                      readOnly={supLocked}
                    />
                  </Stack>
                  <Stack item>
                    <label
                      htmlFor="State"
                      style={{
                        display: "inline-block",
                        width: "150px",
                        verticalAlign: "top",
                      }}
                    >
                      State{" "}
                    </label>
                    <input
                      type="text"
                      name="State"
                      value={inputData.State}
                      onChange={handleInputChange}
                      style={{ width: "140px", display: "inline-block" }}
                      readOnly={supLocked}
                    />
                  </Stack>
                </Stack>

                <Stack
                  padding={1}
                  direction="row"
                  alignItems="flex-start"
                  justifyContent="flex-end"
                >
                  <Stack item>
                    <Button
                      type="submit"
                      variant="contained"
                      size="small"
                      color="success"
                    >
                      Submit All
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </form>
          </Box>
        </main>
      </Box>
    </Layout>
  );
};

// You'll learn about this in the next task, just copy it for now
export const Head = () => <title>Insert Record</title>;

// Step 3: Export your component
export default InsertRecord;