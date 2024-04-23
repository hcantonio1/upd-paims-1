import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  doc,
  updateDoc,
  getDoc,
  getDocs,
  collection,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../firebase-config";

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

      console.log(formData.DateIssued);
      console.log(Timestamp.fromDate(new Date(formData.DateIssued)));
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
    <Box display="flex" flexDirection="column">
      <Box sx={{ backgroundColor: "#e5e5e5", padding: 1 }}>
        <Typography variant="h9" fontWeight={"bold"}>
          Update an Existing Property in the Database
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            p: 2,
            borderStyle: "solid",
            borderColor: "#e5e5e5",
          }}
        >
          <Typography variant="h9" fontWeight={"bold"}>
            Property Details
          </Typography>
          <Divider></Divider>

          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              px: 1,
              gap: 1,
            }}
          >
            <Stack item sx={{ width: 1 / 3 }}>
              <TextField1
                id="PropertyID"
                label="Property ID"
                value={formData.PropertyID}
                onChange={handleInputChange}
                pattern="[0-9]*"
                title="Numbers only."
              />
            </Stack>
            <Stack item sx={{ width: 1 / 3 }}>
              <FormControl>
                <InputLabel id="select-trustee">Trustee</InputLabel>
                <Select
                  size="small"
                  labelId="select-trustee"
                  id="TrusteeID"
                  value={formData.TrusteeID}
                  label="Trustee"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      TrusteeID: e.target.value,
                    })
                  }
                >
                  {users.map((user, index) => (
                    <MenuItem key={`Trustee_${index}`} value={user.UserID}>
                      {getFullName(user)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Stack>
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              px: 1,
              gap: 1,
              mb: 2,
            }}
          >
            <Stack item sx={{ width: 1 / 3 }}>
              <FormControl>
                <InputLabel id="select-status">Status</InputLabel>
                <Select
                  size="small"
                  labelId="select-status"
                  id="StatusID"
                  value={formData.StatusID}
                  label="Status"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      StatusID: e.target.value,
                    })
                  }
                >
                  {statuses.map((status, index) => (
                    <MenuItem key={`Status_${index}`} value={status.StatusID}>
                      {status.StatusName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Stack item sx={{ width: 1 / 3 }}>
              <FormControl>
                <InputLabel id="select-location">Location</InputLabel>
                <Select
                  size="small"
                  labelId="select-location"
                  id="LocationID"
                  value={formData.LocationID}
                  label="Location"
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      LocationID: e.target.value,
                    });
                  }}
                >
                  {locations.map((loc, index) => (
                    <MenuItem key={`Location_${index}`} value={loc.LocationID}>
                      {getFullLoc(loc)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Stack>

          <Typography variant="h9" fontWeight={"bold"}>
            Accompanying Document
          </Typography>
          <Divider></Divider>
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              px: 1,
              gap: 1,
            }}
          >
            <Stack item sx={{ width: 1 / 3 }}>
              <TextField1
                id="SpecDoc"
                label="Document Name"
                value={formData.SpecDoc}
                onChange={handleInputChange}
              />
            </Stack>
            <Stack item sx={{ width: 1 / 3 }}>
              <FormControl>
                <InputLabel id="select-type">Type</InputLabel>
                <Select
                  size="small"
                  labelId="select-type"
                  id="DocumentType"
                  value={formData.DocumentType}
                  label="Type"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      DocumentType: e.target.value,
                    })
                  }
                >
                  {types.map((type, index) => (
                    <MenuItem key={`type_${index}`} value={type.Type}>
                      {type.Type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Stack item sx={{ width: 1 / 3 }}>
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
                value={formData.DateIssued}
                onChange={(e) => {
                  console.log(e.target);
                  handleInputChange(e);
                }}
                style={{ width: "300px", display: "inline-block" }}
              />
            </Stack>
          </Stack>
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              px: 1,
              gap: 1,
              mb: 2,
            }}
          >
            <Stack item sx={{ width: 1 / 3 }}>
              <FormControl>
                <InputLabel id="select-issuedby">Issued By</InputLabel>
                <Select
                  size="small"
                  labelId="select-issuedby"
                  id="IssuedBy"
                  value={formData.IssuedBy}
                  label="Issued By"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      IssuedBy: e.target.value,
                    })
                  }
                >
                  {users.map((user, index) => (
                    <MenuItem key={`IssuedBy_${index}`} value={user.UserID}>
                      {getFullName(user)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Stack item sx={{ width: 1 / 3 }}>
              <FormControl>
                <InputLabel id="select-receivedby">Received By</InputLabel>
                <Select
                  size="small"
                  labelId="select-receivedby"
                  id="ReceivedBy"
                  value={formData.ReceivedBy}
                  label="Received By"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ReceivedBy: e.target.value,
                    })
                  }
                >
                  {users.map((user, index) => (
                    <MenuItem key={`ReceivedBy_${index}`} value={user.UserID}>
                      {getFullName(user)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Stack item sx={{ width: 1 / 3 }}>
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
              />
            </Stack>
          </Stack>
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              px: 1,
              gap: 1,
              mb: 2,
            }}
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
                Update Property
              </Button>
            </Stack>
          </Stack>
        </Box>
      </form>
    </Box>
  );
};

export default UpdateProp;

// const StackRow = (props) => {
//     return <Stack item></Stack>
// }
const TextField1 = (props) => {
  return <TextField {...props} size="small" variant="outlined" />;
};
