// Step 1: Import React
import * as React from "react";
import { Link } from "gatsby";
import Layout from "../layout";
import { useState, useEffect } from "react";
import { db, storage } from "../../../firebase-config";
import {
  doc,
  updateDoc,
  Timestamp,
  getDoc,
  collection,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { makeStyles } from "@material-ui/core";
import { Typography, Divider, Box, Button, Stack } from "@mui/material";

const UpdateRec = () => {
  const [updateProperty, setUpdateProperty] = useState({
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

  const [updateSupplier, setUpdateSupplier] = useState({
    SupplierContact: "",
    UnitNumber: "",
    StreetName: "",
    City: "",
    State: "",
    SupplierID: "",
    SupplierName: "",
  });

  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);

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

  const fetchSupplierData = async (supplierId) => {
    try {
      const supRef = doc(db, "supplier", supplierId);
      const supSnap = await getDoc(supRef);

      if (supSnap.exists()) {
        const supData = supSnap.data();
        setUpdateSupplier((prevData) => ({
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
        setUpdateSupplier((prevData) => ({
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

  const fetchPropertyData = async (propId) => {
    try {
      const propRef = doc(db, "property", propId);
      const propSnap = await getDoc(propRef);
      if (propSnap.exists()) {
        const propData = propSnap.data();
        setUpdateProperty((prevData) => ({
          ...prevData,
          LocationID: parseInt(propData.LocationID),
          StatusID: parseInt(propData.StatusID),
          TrusteeID: parseInt(propData.TrusteeID),
          VerNum: propData.VerNum,
        }));
      }
      if (!propSnap.exists()) {
        setUpdateProperty((prevData) => ({
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

  const handleUpdateSupplier = async (e) => {
    e.preventDefault();

    try {
      const supplierRef = doc(db, "supplier", updateSupplier.SupplierID);
      await updateDoc(supplierRef, {
        City: updateSupplier.City,
        State: updateSupplier.State,
        StreetName: updateSupplier.StreetName,
        SupplierContact: updateSupplier.SupplierContact.toString(),
        SupplierName: updateSupplier.SupplierName,
        UnitNumber: parseInt(updateSupplier.UnitNumber),
      });
      alert("Successfully updated supplier!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating supplier:", error);
      alert("Failed to update supplier.");
    }
  };

  const handleUpdateProperty = async (e) => {
    e.preventDefault();

    try {
      var iirupUpdate = {};
      var parUpdate = {};
      var icsUpdate = {};
      var newVar = updateProperty.VerNum + 1;
      var archiveStat = 0;
      if (updateProperty.DocumentType === "IIRUP") {
        iirupUpdate[`iirupID.${newVar}`] = updateProperty.SpecDoc;
        archiveStat = 1;
      } else if (updateProperty.DocumentType === "PAR") {
        parUpdate[`parID.${newVar}`] = updateProperty.SpecDoc;
      } else {
        icsUpdate[`icsID.${newVar}`] = updateProperty.SpecDoc;
      }
      const propertyRef = doc(db, "property", updateProperty.PropertyID);
      updateDoc(propertyRef, icsUpdate);
      updateDoc(propertyRef, parUpdate);
      updateDoc(propertyRef, iirupUpdate);
      
      console.log("Uploading file to Firebase Storage");
      const fileRef = ref(storage, "DCS/" + updateProperty.Link.name);
      await uploadBytes(fileRef, updateProperty.Link);
      const fileUrl = await getDownloadURL(fileRef);
      console.log("File uploaded successfully:", fileUrl);

      await updateDoc(propertyRef, {
        LocationID: parseInt(updateProperty.LocationID),
        StatusID: parseInt(updateProperty.StatusID),
        TrusteeID: parseInt(updateProperty.TrusteeID),
        isArchived: archiveStat,
        VerNum: newVar,
      });

      await setDoc(doc(db, "item_document", updateProperty.SpecDoc), {
        DateIssued: Timestamp.fromDate(new Date(updateProperty.DateIssued)),
        DocumentID: updateProperty.SpecDoc,
        DocumentType: updateProperty.DocumentType,
        IssuedBy: updateProperty.IssuedBy,
        Link: fileUrl,
        ReceivedBy: updateProperty.ReceivedBy,
      });
      alert("Successfully updated property!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating property:", error);
      alert("Failed to update property.");
    }
  };

  const handleUpdatePropChange = async (e) => {
    setUpdateProperty({
      ...updateProperty,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "PropertyID") {
      fetchPropertyData(e.target.value);
    }
  };

  const handleUpdateSupChange = async (e) => {
    setUpdateSupplier({
      ...updateSupplier,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "SupplierID") {
      fetchSupplierData(e.target.value);
    }
  };

  // ARCHIVE RECORD FUNCTIONS
  const [archiveData, setArchiveData] = useState({
    PropertyID: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [textInput, setTextInput] = useState("");

  const handleTextChange = (event) => {
    setTextInput(event.target.value);
  };

  const fetchArchiveData = async (archiveId) => {
    try {
      const arcRef = doc(db, "property", archiveId);
      const arcSnap = await getDoc(arcRef);

      if (arcSnap.exists()) {
        const arcData = arcSnap.data();
        if (arcData.isArchived === 0) {
          setButtonDisabled(false);
        } else {
          setButtonDisabled(true);
        }
        setArchiveData((prevData) => ({
          ...prevData,
          isArchived: arcData.isArchived,
        }));
      }
      if (!arcSnap.exists()) {
        setButtonDisabled(false);
        setArchiveData((prevData) => ({
          ...prevData,
          isArchived: "",
        }));
      }
    } catch (error) {
      console.error("Error fetching archived:", error);
    }
  };

  const handleArchive = async (e) => {
    e.preventDefault();

    try {
      const archiveRef = doc(db, "property", archiveData.PropertyID);
      await updateDoc(archiveRef, {
        isArchived: 1,
      });
      alert("Successfully archived!");
      window.location.reload();
    } catch (error) {
      console.error("Error archiving:", error);
      alert("Failed to archive.");
    }
  };

  const handleArchiveChange = (e) => {
    setArchiveData({
      ...archiveData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "PropertyID") {
      fetchArchiveData(e.target.value);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUpdateProperty({
      ...updateProperty,
      Link: file,
    });
  };

  const useStyles = makeStyles({
    root: {
      padding: 20,
      margin: 5,
    },

    updateRecordTextContainer: {
      backgroundColor: "#e5e5e5",
      padding: 10,
    },

    updateRecordFields: {
      borderStyle: "solid",
      borderColor: "#e5e5e5",
      padding: 10,
      mr: 150,
    },
  });

  const classes = useStyles();

  return (
    <Layout pageTitle="UPDATE / ARCHIVE">
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
            <Box className={classes.updateRecordTextContainer}>
              <Typography variant="h9" fontWeight={"bold"}>
                Update an Existing Record in the Database
              </Typography>
            </Box>

            <form onSubmit={handleUpdateProperty}>
              <Box sx={{ pt: 3, pb: 2 }} className={classes.updateRecordFields}>
                <Typography variant="h9" fontWeight={"bold"}>
                  Update Item Details
                </Typography>
                <Divider></Divider>

                {/* FIELDS: PropertyID, Trustee */}
                <Stack
                  padding={1}
                  spacing={10}
                  mt={2}
                  direction="row"
                  justifyContent="flex-start"
                >
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
                      value={updateProperty.PropertyID}
                      onChange={handleUpdatePropChange}
                      style={{ width: "300px", display: "inline-block" }}
                      pattern="[0-9]*"
                      title="Numbers only."
                      required
                    />
                  </Stack>
                  <Stack item>
                    <label
                      htmlFor="TrusteeID"
                      style={{
                        display: "inline-block",
                        width: "250px",
                        verticalAlign: "top",
                      }}
                    >
                      Trustee{" "}
                    </label>
                    <select
                      name="TrusteeID"
                      value={updateProperty.TrusteeID}
                      onChange={handleUpdatePropChange}
                      style={{ width: "300px", display: "inline-block" }}
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

                {/* FIELDS: Status, Location */}
                <Stack
                  padding={1}
                  spacing={10}
                  mb={1}
                  direction="row"
                  justifyContent="flex-start"
                >
                  <Stack item>
                    <label
                      htmlFor="Status"
                      style={{
                        display: "inline-block",
                        width: "150px",
                        verticalAlign: "top",
                      }}
                    >
                      Status{" "}
                    </label>
                    <select
                      name="StatusID"
                      value={updateProperty.StatusID}
                      onChange={handleUpdatePropChange}
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
                      Location{" "}
                    </label>
                    <select
                      name="LocationID"
                      value={updateProperty.LocationID}
                      onChange={handleUpdatePropChange}
                      style={{ width: "300px", display: "inline-block" }}
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

                { /* FIELDS: Document Name, Document Type */}
                <Stack
                  padding={1}
                  spacing={10}
                  mt={1}
                  direction="row"
                  justifyContent="flex-start"
                >
                  <Stack item>
                    <label
                      htmlFor="SpecDoc"
                      style={{
                        display: "inline-block",
                        width: "150px",
                        verticalAlign: "top",
                      }}
                    >
                      New Document Name
                    </label>
                    <input
                      type="text"
                      name="SpecDoc"
                      value={updateProperty.SpecDoc}
                      onChange={handleUpdatePropChange}
                      style={{ width: "300px", display: "inline-block" }}
                    />
                  </Stack>
                  <Stack item>
                    <label
                      htmlFor="Document Type"
                      style={{
                        display: "inline-block",
                        width: "250px",
                        verticalAlign: "top",
                      }}
                    >
                      New Document Type{" "}
                    </label>
                    <select
                      name="DocumentType"
                      value={updateProperty.DocumentType}
                      onChange={handleUpdatePropChange}
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
                </Stack>

                {/* FIELDS: DateIssued, New File */}
                <Stack
                  padding={1}
                  spacing={10}
                  mt={2}
                  direction="row"
                  justifyContent="flex-start"
                >
                  <Stack item>
                    <label
                      htmlFor="DateIssued"
                      style={{
                        display: "inline-block",
                        width: "150px",
                        verticalAlign: "top",
                      }}
                    >
                      Date Issued
                    </label>
                    <input
                      type="date"
                      name="DateIssued"
                      value={updateProperty.DateIssued}
                      onChange={handleUpdatePropChange}
                      style={{ width: "300px", display: "inline-block" }}
                      required
                    />
                  </Stack>
                  <Stack item>
                    <label
                      htmlFor="New File"
                      style={{
                        display: "inline-block",
                        width: "250px",
                        verticalAlign: "top",
                      }}
                    >
                      New File{" "}
                    </label>
                    <input
                      type="file"
                      name="Link"
                      onChange={handleFileChange}
                      style={{ width: "250px", display: "inline-block" }}
                      required
                    />
                  </Stack>
                </Stack>

                { /* FIELDS: Issued By, Received By */}
                <Stack
                  padding={1}
                  spacing={10}
                  mt={1}
                  direction="row"
                  justifyContent="flex-start"
                >
                  <Stack item>
                    <label
                      htmlFor="IssuedBy"
                      style={{
                        display: "inline-block",
                        width: "250px",
                        verticalAlign: "top",
                      }}
                    >
                      Issued By{" "}
                    </label>
                    <select
                      name="IssuedBy"
                      value={updateProperty.IssuedBy}
                      onChange={handleUpdatePropChange}
                      style={{ width: "300px", display: "inline-block" }}
                      required
                    >
                      <option value="">Select Issued By</option>
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
                  <Stack item>
                    <label
                      htmlFor="ReceivedBy"
                      style={{
                        display: "inline-block",
                        width: "250px",
                        verticalAlign: "top",
                      }}
                    >
                      Received By{" "}
                    </label>
                    <select
                      name="ReceivedBy"
                      value={updateProperty.ReceivedBy}
                      onChange={handleUpdatePropChange}
                      style={{ width: "300px", display: "inline-block" }}
                      required
                    >
                      <option value="">Select Received By</option>
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
                      Submit
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </form>
          </Box>

          <br />
          <br />
          <Box display="flex" flexDirection="column">
            <Box className={classes.updateRecordTextContainer}>
              <Typography variant="h9" fontWeight={"bold"}>
                Update a Supplier in the Database
              </Typography>
            </Box>

            <form onSubmit={handleUpdateSupplier}>
              <Box sx={{ pt: 3, pb: 3 }} className={classes.updateRecordFields}>
                <Typography variant="h9" fontWeight={"bold"}>
                  Update Supplier Details
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
                      value={updateSupplier.SupplierID}
                      onChange={handleUpdateSupChange}
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
                      value={updateSupplier.SupplierName}
                      onChange={handleUpdateSupChange}
                      style={{ width: "300px", display: "inline-block" }}
                      required
                    />
                  </Stack>
                  <Stack item>
                    <label
                      htmlFor="SupplierContact"
                      style={{
                        display: "inline-block",
                        width: "150px",
                        verticalAlign: "top",
                      }}
                    >
                      Supplier Contact{" "}
                    </label>
                    <input
                      type="text"
                      name="SupplierContact"
                      value={updateSupplier.SupplierContact}
                      onChange={handleUpdateSupChange}
                      style={{ width: "250px", display: "inline-block" }}
                      pattern="[0-9]*"
                      title="Numbers only."
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
                      Unit Number{" "}
                    </label>
                    <input
                      type="text"
                      name="UnitNumber"
                      value={updateSupplier.UnitNumber}
                      onChange={handleUpdateSupChange}
                      style={{ width: "110px", display: "inline-block" }}
                      pattern="[0-9]*"
                      title="Numbers only."
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
                      value={updateSupplier.StreetName}
                      onChange={handleUpdateSupChange}
                      style={{ width: "300px", display: "inline-block" }}
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
                      name="City1"
                      value={updateSupplier.City}
                      onChange={handleUpdateSupChange}
                      style={{ width: "290px", display: "inline-block" }}
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
                      name="State1"
                      value={updateSupplier.State}
                      onChange={handleUpdateSupChange}
                      style={{ width: "140px", display: "inline-block" }}
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
                      Submit
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </form>
          </Box>

          <br />
          <br />
          <Box display="flex" flexDirection="column">
            <Box className={classes.updateRecordTextContainer}>
              <Typography variant="h9" fontWeight={"bold"}>
                Archive a Record in the Database
              </Typography>
            </Box>

            <form onSubmit={handleArchive}>
              <Box sx={{ pt: 3, pb: 3 }} className={classes.updateRecordFields}>
                <Typography variant="h9" fontWeight={"bold"}>
                  Record Details
                </Typography>
                <Divider></Divider>

                {/* FIELDS: PropertyID, ArchiveStatus */}
                <Stack
                  padding={1}
                  spacing={10}
                  mt={2}
                  direction="row"
                  justifyContent="flex-start"
                >
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
                      value={archiveData.PropertyID}
                      onChange={handleArchiveChange}
                      style={{ width: "300px", display: "inline-block" }}
                      pattern="[0-9]*"
                      title="Numbers only."
                      required
                    />
                  </Stack>
                  <Stack item>
                    <label
                      htmlFor="isArchived"
                      style={{
                        display: "inline-block",
                        width: "250px",
                        verticalAlign: "top",
                      }}
                    >
                      Current Archive Status
                      <span style={{ color: "red" }}></span>{" "}
                    </label>
                    <input
                      type="text"
                      name="isArchived"
                      value={archiveData.isArchived}
                      onChange={handleArchiveChange}
                      style={{ width: "300px", display: "inline-block" }}
                      readOnly={true}
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
                      disabled={buttonDisabled}
                      variant="contained"
                      size="small"
                      color="success"
                    >
                      Submit
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
export const Head = () => <title>Update Database</title>;

// Step 3: Export your component
export default UpdateRec;

//personal notes
//current problems with adding record:
//lengthy process if doing it one by one per property