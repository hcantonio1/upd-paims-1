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
import { Typography, Divider, Box, Button, Stack } from "@mui/material";

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

    fetchUsers();
    fetchCategories();
    fetchLocations();
    fetchStatuses();
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
      await setDoc(doc(db, "supplier", inputData.SupplierID), {
        City: inputData.City,
        State: inputData.State,
        StreetName: inputData.StreetName,
        SupplierContact: inputData.SupplierContact.toString(),
        SupplierID: parseInt(inputData.SupplierID),
        SupplierName: inputData.SupplierName,
        UnitNumber: parseInt(inputData.UnitNumber),
      });
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
      var docObject = {};
      docObject[inputData.TrusteeID] = inputData.DocumentID;
      await setDoc(doc(db, "property", inputData.PropertyID), {
        CategoryID: parseInt(inputData.CategoryID),
        DocumentID: docObject,
        isArchived: 0,
        LocationID: parseInt(inputData.LocationID),
        PropertyID: parseInt(inputData.PropertyID),
        PropertyName: inputData.PropertyName,
        TrusteeID: parseInt(inputData.TrusteeID),
        StatusID: parseInt(inputData.StatusID),
        SupplierID: parseInt(inputData.SupplierID),
        PurchaseOrderID: parseInt(inputData.PurchaseOrderID),
      });
      await setDoc(doc(db, "purchase_order", inputData.PurchaseOrderID), {
        PurchaseDate: Timestamp.fromDate(new Date(inputData.PurchaseDate)),
        PurchaseOrderID: parseInt(inputData.PurchaseOrderID),
        SupplierID: parseInt(inputData.SupplierID),
        TotalCost: parseInt(inputData.TotalCost),
      });
      alert("Successfully inserted!");
      window.location.reload();
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

  const handleInputChange = (e) => {
    setInputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });

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
          <Box sx={{ mb: 3 }}>
            <Button
              href="/app/submitform/"
              variant="outlined"
              size="small"
              color="success"
            >
              Back to Forms
            </Button>
          </Box>

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

                {itemDetailsCount.map(() => (
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
                          htmlFor="PropertyID"
                          style={{
                            display: "inline-block",
                            width: "150px",
                            verticalAlign: "top",
                          }}
                        >
                          Property ID<span style={{ color: "red" }}>*</span>{" "}
                        </label>
                        <input
                          type="text"
                          name="PropertyID"
                          value={inputData.PropertyID}
                          onChange={handleInputChange}
                          style={{ width: "300px", display: "inline-block" }}
                          pattern="[0-9]*"
                          title="Numbers only."
                          required
                        />
                      </Stack>

                      <Stack item>
                        <label
                          htmlFor="PropertyName"
                          style={{
                            display: "inline-block",
                            width: "150px",
                            verticalAlign: "top",
                          }}
                        >
                          Property Name<span style={{ color: "red" }}>*</span>{" "}
                        </label>
                        <input
                          type="text"
                          name="PropertyName"
                          value={inputData.PropertyName}
                          onChange={handleInputChange}
                          style={{ width: "300px", display: "inline-block" }}
                          required
                        />
                      </Stack>
                      <Stack item>
                        <label
                          htmlFor="TrusteeID"
                          style={{ display: "inline-block", verticalAlign: "top" }}
                        >
                          Trustee<span style={{ color: "red" }}>*</span>{" "}
                        </label>
                        <select
                          name="TrusteeID"
                          value={inputData.TrusteeID}
                          onChange={handleInputChange}
                          style={{ width: "250px", display: "inline-block" }}
                          required
                        >
                          <option value="">Select Trustee</option>
                          {users.map((user, index) => (
                            <option
                              key={`Trustee_${index}`}
                              value={user.UserID}
                            >
                              {getFullName(user)}
                            </option>
                          ))}
                        </select>
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
                          htmlFor="CategoryID"
                          style={{
                            display: "inline-block",
                            width: "150px",
                            verticalAlign: "top",
                          }}
                        >
                          Category<span style={{ color: "red" }}>*</span>{" "}
                        </label>
                        <select
                          name="CategoryID"
                          value={inputData.CategoryID}
                          onChange={handleInputChange}
                          style={{ width: "300px", display: "inline-block" }}
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map((category, index) => (
                            <option
                              key={`category_${index}`}
                              value={category.CategoryID}
                            >
                              {category.CategoryName}
                            </option>
                          ))}
                        </select>
                      </Stack>
                      <Stack item>
                        <label
                          htmlFor="StatusID"
                          style={{
                            display: "inline-block",
                            width: "150px",
                            verticalAlign: "top",
                          }}
                        >
                          Status<span style={{ color: "red" }}>*</span>{" "}
                        </label>
                        <select
                          name="StatusID"
                          value={inputData.StatusID}
                          onChange={handleInputChange}
                          style={{ width: "300px", display: "inline-block" }}
                        >
                          <option value="">Select Status</option>
                          {statuses.map((status, index) => (
                            <option key={`status${index}`} value={status.StatusID}>
                              {status.StatusName}
                            </option>
                          ))}
                        </select>
                      </Stack>
                      <Stack item>
                        <label
                          htmlFor="LocationID"
                          style={{
                            display: "inline-block",
                            width: "150px",
                            verticalAlign: "top",
                          }}
                        >
                          Location<span style={{ color: "red" }}>*</span>{" "}
                        </label>
                        <select
                          name="LocationID"
                          value={inputData.LocationID}
                          onChange={handleInputChange}
                          style={{ width: "250px", display: "inline-block" }}
                          required
                        >
                          <option value="">Select Location</option>
                          {locations.map((location, index) => (
                            <option
                              key={`location_${index}`}
                              value={location.LocationID}
                            >
                              {getFullLoc(location)}
                            </option>
                          ))}
                        </select>
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
                          htmlFor="PurchaseOrderID"
                          style={{
                            display: "inline-block",
                            width: "200px",
                            verticalAlign: "top",
                          }}
                        >
                          Purchase Order ID<span style={{ color: "red" }}>*</span>{" "}
                        </label>
                        <input
                          type="text"
                          name="PurchaseOrderID"
                          value={inputData.PurchaseOrderID}
                          onChange={handleInputChange}
                          style={{ width: "300px", display: "inline-block" }}
                          pattern="[0-9]*"
                          title="Numbers only."
                          required
                        />
                      </Stack>
                      <Stack item>
                        <label
                          htmlFor="TotalCost"
                          style={{
                            display: "inline-block",
                            width: "150px",
                            verticalAlign: "top",
                          }}
                        >
                          Total Cost<span style={{ color: "red" }}>*</span>{" "}
                        </label>
                        <input
                          type="text"
                          name="TotalCost"
                          value={inputData.TotalCost}
                          onChange={handleInputChange}
                          style={{ width: "300px", display: "inline-block" }}
                          pattern="^\d*\.?\d+$"
                          title="Please enter a positive number."
                          required
                          readOnly={orderLocked}
                        />
                      </Stack>
                      <Stack item>
                        <label
                          htmlFor="PurchaseDate"
                          style={{
                            display: "inline-block",
                            width: "150px",
                            verticalAlign: "top",
                          }}
                        >
                          Purchase Date<span style={{ color: "red" }}>*</span>{" "}
                        </label>
                        <input
                          type="date"
                          name="PurchaseDate"
                          value={inputData.PurchaseDate}
                          onChange={handleInputChange}
                          style={{ width: "250px", display: "inline-block" }}
                          required
                          readOnly={orderLocked}
                        />
                      </Stack>
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
                      htmlFor="DocumentType"
                      style={{
                        display: "inline-block",
                        width: "200px",
                        verticalAlign: "top",
                      }}
                    >
                      Document Type<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                    <input
                      type="text"
                      name="DocumentType"
                      value={inputData.DocumentType}
                      onChange={handleInputChange}
                      style={{ width: "300px", display: "inline-block" }}
                      required
                      readOnly={docLocked}
                    />
                  </Stack>
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

//           <form onSubmit={handleInsert}>
//             <div>
//               <p>Insert Record Details</p>
//               <label htmlFor="SupplierID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Supplier ID<span style={{ color: 'red' }}>*</span>:   </label>
//               <input type="text" name="SupplierID" value={inputData.SupplierID} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." required/>
//               <br />
//               <label htmlFor="SupplierName" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Supplier Name:   </label>
//               <input type="text" name="SupplierName" value={inputData.SupplierName} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} readOnly={supLocked} />
//               <br />
//               <label htmlFor="SupplierContact" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Supplier Contact:   </label>
//               <input type="text" name="SupplierContact" value={inputData.SupplierContact} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." readOnly={supLocked} />
//               <br />
//               <label htmlFor="UnitNumber" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Unit Number:   </label>
//               <input type="text" name="UnitNumber" value={inputData.UnitNumber} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." readOnly={supLocked} />
//               <br />
//               <label htmlFor="StreetName" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Street Name:   </label>
//               <input type="text" name="StreetName" value={inputData.StreetName} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} readOnly={supLocked} />
//               <br />
//               <label htmlFor="City" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>City:   </label>
//               <input type="text" name="City" value={inputData.City} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} readOnly={supLocked} />
//               <br />
//               <label htmlFor="State" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>State:   </label>
//               <input type="text" name="State" value={inputData.State} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} readOnly={supLocked} />
//               <br />
//               <label htmlFor="DocumentID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Document Name<span style={{ color: 'red' }}>*</span>:   </label>
//               <input type="text" name="DocumentID" value={inputData.DocumentID} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} required/>
//               <br />
//               <label htmlFor="DocumentType" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Document Type<span style={{ color: 'red' }}>*</span>:   </label>
//               <input type="text" name="DocumentType" value={inputData.DocumentType} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} required readOnly={docLocked}/>
//               <br />
//               <label htmlFor="DateIssued" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Date Issued<span style={{ color: 'red' }}>*</span>:   </label>
//               <input type="date" name="DateIssued" value={inputData.DateIssued} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} required readOnly={docLocked}/>
//               <br />
//               <label htmlFor="IssuedBy" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Issued By<span style={{ color: 'red' }}>*</span>:   </label>
//               <select name="IssuedBy" value={inputData.IssuedBy} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} required disabled={docLocked}>
//                 <option value="">Select Issued By</option>
//                 {users.map((user, index) => (
//                   <option key={user.Username} value={user.Username}>{getFullName(user)}</option>
//                 ))}
//               </select>
//               <br />
//               <label htmlFor="ReceivedBy" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Received By<span style={{ color: 'red' }}>*</span>:   </label>
//               <select name="ReceivedBy" value={inputData.ReceivedBy} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} required disabled={docLocked}>
//                 <option value="">Select Received By</option>
//                 {users.map((user, index) => (
//                   <option key={user.Username} value={user.Username}>{getFullName(user)}</option>
//                 ))}
//               </select>
//               <br />
//               <label htmlFor="Link" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>File<span style={{ color: 'red' }}>*</span>:   </label>
//               <input type="file" name="Link" onChange={handleFileChange} style={{ width: '300px', display: 'inline-block' }} required disabled={docLocked}/>
//               <br />
//               <label htmlFor="PropertyID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Property ID<span style={{ color: 'red' }}>*</span>:   </label>
//               <input type="text" name="PropertyID" value={inputData.PropertyID} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." required/>
//               <br />
//               <label htmlFor="PropertyName" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Property Name<span style={{ color: 'red' }}>*</span>:   </label>
//               <input type="text" name="PropertyName" value={inputData.PropertyName} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} required/>
//               <br />
//               <label htmlFor="StatusID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Status<span style={{ color: 'red' }}>*</span>:   </label>
//               <select name="StatusID" value={inputData.StatusID} onChange={handleInputChange} style={{ width: '310px', display: 'inline-block' }} >
//               <option value ="">Select Status</option>
//                 {statuses.map((status, index) => (
//                   <option key={`status${index}`} value={status.StatusID}>{status.StatusName}</option>
//                 ))}
//               </select>
//               <br />
//               <label htmlFor="TrusteeID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Trustee<span style={{ color: 'red' }}>*</span>:   </label>
//               <select name="TrusteeID" value={inputData.TrusteeID} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} required >
//                 <option value="">Select Trustee</option>
//                 {users.map((user, index) => (
//                   <option key={`Trustee_${index}`} value={user.UserID}>{getFullName(user)}</option>
//                 ))}
//               </select>
//               <label htmlFor="LocationID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Location<span style={{ color: 'red' }}>*</span>:   </label>
//               <select name="LocationID" value={inputData.LocationID} onChange={handleInputChange} style={{ width: '310px', display: 'inline-block' }} required >
//                 <option value ="">Select Location</option>
//                 {locations.map((location, index) => (
//                   <option key={`location_${index}`} value={location.LocationID}>{getFullLoc(location)}</option>
//                 ))}
//               </select>
//               <br />
//               <label htmlFor="CategoryID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Category<span style={{ color: 'red' }}>*</span>:   </label>
//               <select name="CategoryID" value={inputData.CategoryID} onChange={handleInputChange} style={{ width: '310px', display: 'inline-block' }} required >
//                 <option value ="">Select Category</option>
//                 {categories.map((category, index) => (
//                   <option key={`category_${index}`} value={category.CategoryID}>{category.CategoryName}</option>
//                 ))}
//               </select>
//               <br />
//               <label htmlFor="PurchaseOrderID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Purchase Order ID<span style={{ color: 'red' }}>*</span>:   </label>
//               <input type="text" name="PurchaseOrderID" value={inputData.PurchaseOrderID} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." required />
//               <br />
//               <label htmlFor="PurchaseDate" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Purchase Date<span style={{ color: 'red' }}>*</span>:   </label>
//               <input type="date" name="PurchaseDate" value={inputData.PurchaseDate} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} required readOnly={orderLocked}/>
//               <br />
//               <label htmlFor="TotalCost" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Total Cost<span style={{ color: 'red' }}>*</span>:   </label>
//               <input type="text" name="TotalCost" value={inputData.TotalCost} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} pattern="^\d*\.?\d+$" title="Please enter a positive number." required readOnly={orderLocked}/>
//             </div>
//             <button type="submit">Submit</button>
//           </form>
//         </main>
//       </Box>
//     </Layout>
//   );
// };
