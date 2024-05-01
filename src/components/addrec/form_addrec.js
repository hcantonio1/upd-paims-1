import * as React from "react";
import Layout from "../common/layout";
import { useState, useEffect } from "react";
import { db, storage } from "../../../firebase-config";
import { doc, setDoc, Timestamp, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Typography, Divider, Box, Button, Stack, TextField } from "@mui/material";
// import { CloudUpload } from "@material-ui/icons";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import SelectTextField from "../common/selectTextField";

import { autofillDocumentData, autofillSupplierData } from "../../formutils/formautofill";
import { fetchDeptUsers, fetchCategories, fetchStatuses, fetchDeptLocations, fetchTypes } from "../../formutils/fetchdropdowndata";
import { insertDocument as handleInsertDoc } from "./handleinsert";

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
    Documents: {},
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
          var archiveStat = 0;
          if (inputData.DocumentType === "IIRUP") {
            archiveStat = 1;
          }
          const verNum = "a";
          await setDoc(doc(db, "property", itemData.PropertyID), {
            CategoryID: parseInt(itemData.CategoryID),
            Documents: {verNum : inputData.DocumentID},
            isArchived: archiveStat,
            isApproved: 0,
            LocationID: parseInt(itemData.LocationID),
            PropertyID: parseInt(itemData.PropertyID),
            PropertyName: itemData.PropertyName,
            TrusteeID: parseInt(itemData.TrusteeID),
            StatusID: parseInt(itemData.StatusID),
            SupplierID: parseInt(itemData.SupplierID),
            PurchaseOrderID: parseInt(itemData.PurchaseOrderID),
            VerNum: verNum,
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
      autofillDocumentData(e.target.value, setInputData, setDocLocked);
    }
    if (e.target.name === "SupplierID") {
      autofillPropRowSupp(e.target.value, setInputData, setSupLocked);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setInputData({
      ...inputData,
      Link: file,
    });
  };

  return (
    <Layout pageTitle="INSERT">
      <Box
        display="flex"
        flexDirection="column"
        sx={{
          p: 2,
          m: 1,
        }}
      >
        <main>
          <Box display="flex" flexDirection="column">
            <Box sx={{ bgcolor: "#e5e5e5", p: 1 }}>
              <Typography variant="h9" fontWeight={"bold"}>
                Insert a New Record into the Database
              </Typography>
            </Box>

            <form onSubmit={handleInsert}>
              <Box sx={{ py: 3, px: 1, pb: 1, borderStyle: "solid", borderColor: "#e5e5e5" }}>
                <Typography variant="h9" fontWeight={"bold"}>
                  Item Details
                </Typography>
                <Divider />

                {itemDetailsCount.map((_, index) => (
                  <div key={`itemrow${index}`}>
                    <Stack padding={1} spacing={2} mt={2} direction="row" justifyContent="space-between">
                      {/* FIELDS: PropertyID, PropertyName, Trustee */}
                      <Stack item>
                        <label htmlFor={`PropertyID_${index}`} style={{ display: "inline-block", width: "150px", verticalAlign: "top" }} />
                        <TextField
                          label="Property ID"
                          variant="outlined"
                          name={`PropertyID_${index}`}
                          value={inputData[`PropertyID_${index}`]}
                          onChange={(e) => handleInputChange(e, index)}
                          required
                          sx={{ width: 300 }}
                          type="string"
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
                          title="Numbers only."
                        />
                      </Stack>
                      <Stack item>
                        <label htmlFor={`PropertyName_${index}`} style={{ display: "inline-block", width: "150px", verticalAlign: "top" }} />
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
                        <label htmlFor={`TrusteeID_${index}`} style={{ display: "inline-block", verticalAlign: "top" }} />
                        <SelectTextField
                          label="Select Trustee"
                          name={`TrusteeID_${index}`}
                          value={inputData[`TrusteeID_${index}`] ?? ""}
                          onChange={(e) => handleInputChange(e, index)}
                          options={users}
                          getFunc={getFullName}
                        />
                      </Stack>
                    </Stack>

                    {/* FIELDS: Category, Status, Location */}
                    <Stack padding={1} spacing={2} direction="row" justifyContent="space-between">
                      <Stack item>
                        <label htmlFor={`CategoryID_${index}`} style={{ display: "inline-block", width: "150px", verticalAlign: "top" }} />
                        <SelectTextField
                          label="Select Category"
                          name={`CategoryID_${index}`}
                          value={inputData[`CategoryID_${index}`] ?? ""}
                          onChange={(e) => handleInputChange(e, index)}
                          options={categories}
                        />
                      </Stack>
                      <Stack item>
                        <label htmlFor={`StatusID_${index}`} style={{ display: "inline-block", width: "150px", verticalAlign: "top" }} />

                        <SelectTextField
                          label="Select Status"
                          name={`StatusID_${index}`}
                          value={inputData[`StatusID_${index}`] ?? ""}
                          onChange={(e) => handleInputChange(e, index)}
                          options={statuses}
                        />
                      </Stack>
                      <Stack item>
                        <label htmlFor={`LocationID_${index}`} style={{ display: "inline-block", width: "150px", verticalAlign: "top" }} />

                        <SelectTextField
                          label="Select Location"
                          name={`LocationID_${index}`}
                          value={inputData[`LocationID_${index}`] ?? ""}
                          onChange={(e) => handleInputChange(e, index)}
                          options={locations}
                          getFunc={getFullLoc}
                        />
                      </Stack>
                    </Stack>

                    {/* FIELDS: PurchaseID, PurchaseDate, Cost */}
                    <Stack padding={1} spacing={2} mb={3} direction="row" justifyContent="space-between">
                      <Stack item>
                        <label htmlFor={`PurchaseOrderID_${index}`} style={{ display: "inline-block", width: "200px", verticalAlign: "top" }} />

                        <TextField
                          label="Purchase Order ID"
                          variant="outlined"
                          name={`PurchaseOrderID_${index}`}
                          value={inputData[`PurchaseOrderID_${index}`]}
                          onChange={(e) => handleInputChange(e, index)}
                          type="string"
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
                          title="Numbers only."
                          required
                          sx={{ width: 300 }}
                        />
                      </Stack>
                      <Stack item>
                        <label htmlFor={`TotalCost_${index}`} style={{ display: "inline-block", width: "150px", verticalAlign: "top" }} />
                        <TextField
                          label="Total Cost"
                          variant="outlined"
                          name={`TotalCost_${index}`}
                          value={inputData[`TotalCost_${index}`]}
                          onChange={(e) => handleInputChange(e, index)}
                          type="string"
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            min: "0",
                            step: "any",
                          }}
                          title="Please enter a positive number."
                          required
                          sx={{ width: 300 }}
                          readOnly={orderLocked}
                        />
                      </Stack>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack item>
                          <label htmlFor={`PurchaseDate_${index}`} style={{ display: "inline-block", width: "150px", verticalAlign: "top" }} />
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
                            inputFormat="YYYY-MM-DD"
                            value={inputData[`PurchaseDate_${index}`]}
                            onChange={(value) => setPurchaseDate(value, index)}
                            sx={{ width: 300 }}
                          />
                        </Stack>
                      </LocalizationProvider>
                    </Stack>
                  </div>
                ))}

                <Box display="flex" justifyContent="flex-end">
                  {itemDetailsCount.length > 1 && (
                    <Button variant="contained" sx={{ backgroundColor: "#014421", m: 1 }} onClick={handleRemoveItem}>
                      Remove Item
                    </Button>
                  )}
                  <Button variant="contained" sx={{ backgroundColor: "#014421", m: 1 }} onClick={handleAddItem}>
                    Add Item
                  </Button>
                </Box>

                <Typography variant="h9" fontWeight={"bold"}>
                  Document Details
                </Typography>
                <Divider />

                {/* FIELDS: DocuType, DocuName, File*/}
                <Stack padding={1} spacing={2} mt={2} direction="row" justifyContent="space-between">
                  <Stack item>
                    <label htmlFor="DocumentID" style={{ display: "inline-block", width: "200px", verticalAlign: "top" }} />
                    <TextField label="Document Name" variant="outlined" name="DocumentID" value={inputData.DocumentID} onChange={handleInputChange} required sx={{ width: 300 }} />
                  </Stack>
                  <Stack item>
                    <label htmlFor="DocumentType" style={{ display: "inline-block", width: "200px", verticalAlign: "top" }} />
                    <SelectTextField label="Select Document Type" name="DocumentType" value={inputData.DocumentType} onChange={handleInputChange} options={types} />
                  </Stack>

                  <Stack item>
                    <label htmlFor="Link" style={{ display: "inline-block", width: "250px", verticalAlign: "top" }}>
                      New File{" "}
                    </label>
                    <input type="file" id="Link" onChange={handleFileChange} style={{ width: "250px", display: "inline-block" }} disabled={docLocked} />
                  </Stack>
                  {/* <Stack item>
                    <label htmlFor="Link" style={{ display: "inline-block", width: "150px", verticalAlign: "top" }} />
                    <Button startIcon={<CloudUpload />} sx={{ color: "#014421", width: 300, height: 50 }} component="label" role={undefined}>
                      Upload File
                      <input type="file" name="Link" onChange={handleFileChange} required disabled={docLocked} hidden />
                    </Button>
                  </Stack> */}
                </Stack>

                {/* FIELDS: Issued, Receive, Date */}
                <Stack padding={1} spacing={2} mb={3} direction="row" justifyContent="space-between">
                  <Stack item>
                    <label htmlFor="IssuedBy" style={{ display: "inline-block", width: "150px", verticalAlign: "top" }} />
                    <SelectTextField label="Issued By" name="IssuedBy" value={inputData.IssuedBy} onChange={handleInputChange} options={users} getFunc={getFullName} lock={docLocked} />
                  </Stack>
                  <Stack item>
                    <label htmlFor="ReceivedBy" style={{ display: "inline-block", width: "150px", verticalAlign: "top" }} />
                    <SelectTextField label="Received By" name="ReceivedBy" value={inputData.ReceivedBy} onChange={handleInputChange} options={users} getFunc={getFullName} lock={docLocked} />
                  </Stack>
                  {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
                  <Stack item>
                    <label htmlFor="DateIssued" style={{ display: "inline-block", width: "150px", verticalAlign: "top" }} />
                    <input type="date" name="DateIssued" value={inputData.DateIssued} onChange={handleInputChange} style={{ width: "250px", display: "inline-block" }} required readOnly={docLocked} />
                    {/* <DatePicker
                        label="Date Issued"
                        name="DateIssued"
                        inputFormat="YYYY-MM-DD"
                        value={inputData.DateIssued}
                        onChange={handleInputChange}
                        sx={{ width: 300 }}
                        readOnly={docLocked}
                      /> */}
                  </Stack>
                  {/* </LocalizationProvider> */}
                </Stack>

                <Stack padding={1} direction="row" alignItems="flex-start" justifyContent="flex-end">
                  <Stack item>
                    <Button
                      type="submit"
                      variant="contained"
                      onClick={(e) => {
                        handleInsertDoc(e, inputData);
                      }}
                      sx={{ backgroundColor: "#014421", m: 1 }}
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
                <Stack padding={1} spacing={2} mt={2} direction="row" justifyContent="space-between">
                  <Stack item>
                    <label htmlFor="SupplierID" style={{ display: "inline-block", width: "150px", verticalAlign: "top" }} />
                    <TextField
                      label="Supplier ID"
                      name="SupplierID"
                      value={inputData.SupplierID}
                      onChange={handleInputChange}
                      style={{ width: "300px", display: "inline-block" }}
                      inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                      title="Numbers only."
                      required
                      sx={{ width: 300 }}
                    />
                  </Stack>
                  <Stack item>
                    <label htmlFor="SupplierName" style={{ display: "inline-block", width: "150px", verticalAlign: "top" }} />
                    <TextField label="Supplier Name" name="SupplierName" value={inputData.SupplierName} onChange={handleInputChange} sx={{ width: 300 }} readOnly={supLocked} required />
                  </Stack>
                  <Stack item>
                    <label htmlFor="SupplierContact" style={{ display: "inline-block", width: "200px", verticalAlign: "top" }} />
                    <TextField
                      label="Supplier Contact"
                      name="SupplierContact"
                      value={inputData.SupplierContact}
                      onChange={handleInputChange}
                      sx={{ width: 300 }}
                      pattern="[0-9]*"
                      title="Numbers only."
                      readOnly={supLocked}
                    />
                  </Stack>
                </Stack>

                {/* FIELDS: Unit, Street, City, State */}
                <Stack padding={1} spacing={2} mb={1} direction="row" justifyContent="space-between">
                  <Stack item>
                    <label htmlFor="UnitNumber" style={{ display: "inline-block", width: "120px", verticalAlign: "top" }} />
                    <TextField
                      label="Unit #"
                      name="UnitNumber"
                      value={inputData.UnitNumber}
                      onChange={handleInputChange}
                      sx={{ width: 110 }}
                      pattern="[0-9]*"
                      title="Numbers only."
                      readOnly={supLocked}
                    />
                  </Stack>
                  <Stack item>
                    <label htmlFor="StreetName" style={{ display: "inline-block", width: "150px", verticalAlign: "top" }} />
                    <TextField label="Street Name" name="StreetName" value={inputData.StreetName} onChange={handleInputChange} sx={{ width: 300 }} readOnly={supLocked} />
                  </Stack>
                  <Stack item>
                    <label htmlFor="City" style={{ display: "inline-block", width: "150px", verticalAlign: "top" }} />
                    <TextField label="City" name="City" value={inputData.City} onChange={handleInputChange} sx={{ width: 290 }} readOnly={supLocked} />
                  </Stack>
                  <Stack item>
                    <label htmlFor="State" style={{ display: "inline-block", width: "150px", verticalAlign: "top" }} />
                    <TextField label="State" name="State" value={inputData.State} onChange={handleInputChange} sx={{ width: 140 }} readOnly={supLocked} />
                  </Stack>
                </Stack>

                <Stack padding={1} direction="row" alignItems="flex-start" justifyContent="flex-end">
                  <Stack item>
                    <Button type="submit" variant="contained" sx={{ backgroundColor: "#014421", m: 1 }}>
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
