import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    // if (e.target.id === "PropertyID") {
    //   fetchPropData(e.target.value);
    // }
  };

  const fetchPropData = async (propID) => {
    // try {
    //   const propRef = doc(db, "property", propId);
    //   const propSnap = await getDoc(propRef);
    //   if (propSnap.exists()) {
    //     const propData = propSnap.data();
    //     setUpdateProperty((prevData) => ({
    //       ...prevData,
    //       LocationID: parseInt(propData.LocationID),
    //       StatusID: parseInt(propData.StatusID),
    //       TrusteeID: parseInt(propData.TrusteeID),
    //       VerNum: propData.VerNum,
    //     }));
    //   }
    //   if (!propSnap.exists()) {
    //     setUpdateProperty((prevData) => ({
    //       ...prevData,
    //       LocationID: "",
    //       StatusID: "",
    //       TrusteeID: "",
    //       VerNum: "",
    //     }));
    //   }
    // } catch (error) {
    //   console.error("Error fetching property:", error);
    // }
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

    // try {
    //   var iirupUpdate = {};
    //   var parUpdate = {};
    //   var icsUpdate = {};
    //   var newVar = updateProperty.VerNum + 1;
    //   var archiveStat = 0;
    //   if (updateProperty.DocumentType === "IIRUP") {
    //     iirupUpdate[`iirupID.${newVar}`] = updateProperty.SpecDoc;
    //     archiveStat = 1;
    //   } else if (updateProperty.DocumentType === "PAR") {
    //     parUpdate[`parID.${newVar}`] = updateProperty.SpecDoc;
    //   } else {
    //     icsUpdate[`icsID.${newVar}`] = updateProperty.SpecDoc;
    //   }
    //   const propertyRef = doc(db, "property", updateProperty.PropertyID);
    //   updateDoc(propertyRef, icsUpdate);
    //   updateDoc(propertyRef, parUpdate);
    //   updateDoc(propertyRef, iirupUpdate);

    //   console.log("Uploading file to Firebase Storage");
    //   const fileRef = ref(storage, "DCS/" + updateProperty.Link.name);
    //   await uploadBytes(fileRef, updateProperty.Link);
    //   const fileUrl = await getDownloadURL(fileRef);
    //   console.log("File uploaded successfully:", fileUrl);

    //   await updateDoc(propertyRef, {
    //     LocationID: parseInt(updateProperty.LocationID),
    //     StatusID: parseInt(updateProperty.StatusID),
    //     TrusteeID: parseInt(updateProperty.TrusteeID),
    //     isArchived: archiveStat,
    //     VerNum: newVar,
    //   });

    //   await setDoc(doc(db, "item_document", updateProperty.SpecDoc), {
    //     DateIssued: Timestamp.fromDate(new Date(updateProperty.DateIssued)),
    //     DocumentID: updateProperty.SpecDoc,
    //     DocumentType: updateProperty.DocumentType,
    //     IssuedBy: updateProperty.IssuedBy,
    //     Link: fileUrl,
    //     ReceivedBy: updateProperty.ReceivedBy,
    //   });
    //   alert("Successfully updated property!");
    //   window.location.reload();
    // } catch (error) {
    //   console.error("Error updating property:", error);
    //   alert("Failed to update property.");
    // }
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
              <TextField1
                id="TrusteeID"
                label="Trustee"
                value={formData.TrusteeID}
                onChange={handleInputChange}
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
              <TextField1
                id="StatusID"
                label="Status"
                value={formData.StatusID}
                onChange={handleInputChange}
              />
            </Stack>
            <Stack item sx={{ width: 1 / 3 }}>
              <TextField1
                id="LocationID"
                label="Location"
                value={formData.LocationID}
                onChange={handleInputChange}
              />
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
              <TextField1
                id="DocumentType"
                label="Type"
                value={formData.DocumentType}
                onChange={handleInputChange}
              />
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
                onChange={handleInputChange}
                style={{ width: "300px", display: "inline-block" }}
                required
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
              <TextField1
                id="IssuedBy"
                label="Issued By"
                value={formData.IssuedBy}
                onChange={handleInputChange}
              />
            </Stack>
            <Stack item sx={{ width: 1 / 3 }}>
              <TextField1
                id="ReceivedBy"
                label="Received By"
                value={formData.ReceivedBy}
                onChange={handleInputChange}
              />
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
                required
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
