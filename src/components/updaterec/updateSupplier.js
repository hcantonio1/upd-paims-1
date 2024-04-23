import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";

const UpdateSupplier = () => {
  const [formData, setFormData] = useState({
    SupplierContact: "",
    UnitNumber: "",
    StreetName: "",
    City: "",
    State: "",
    SupplierID: "",
    SupplierName: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    // if (e.target.id === "SupplierID") {
    //   fetchSupplierData(e.target.value);
    // }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const supplierRef = doc(db, "supplier", formData.SupplierID);
      await updateDoc(supplierRef, {
        City: formData.City,
        State: formData.State,
        StreetName: formData.StreetName,
        SupplierContact: formData.SupplierContact.toString(),
        SupplierName: formData.SupplierName,
        UnitNumber: parseInt(formData.UnitNumber),
      });
      alert("Successfully updated supplier!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating supplier:", error);
      alert("Failed to update supplier.");
    }
  };

  return (
    <Box display="flex" flexDirection="column">
      <Box sx={{ backgroundColor: "#e5e5e5", padding: 1 }}>
        <Typography variant="h9" fontWeight={"bold"}>
          Update a Supplier in the Database
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
            Supplier Details
          </Typography>
          <Divider></Divider>

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
                id="SupplierID"
                label="Supplier ID"
                onChange={handleInputChange}
                pattern="[0-9]*"
                title="Numbers only."
                required
              />
            </Stack>
            <Stack item sx={{ width: 1 / 3 }}>
              <TextField1
                id="SupplierName"
                label="Supplier Name"
                onChange={handleInputChange}
                required
              />
            </Stack>
            <Stack item sx={{ width: 1 / 3 }}>
              <TextField1
                id="SupplierContact"
                label="Contact Number"
                onChange={handleInputChange}
                required
              />
            </Stack>
          </Stack>

          <Typography variant="h9" fontWeight={"bold"}>
            Supplier Address
          </Typography>
          <Divider></Divider>
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              px: 1,
              gap: 1,
              mb: 2,
            }}
          >
            <Stack item sx={{ width: 1 / 4 }}>
              <TextField1
                id="UnitNumber"
                label="Unit Number"
                onChange={handleInputChange}
              />
            </Stack>
            <Stack item sx={{ width: 1 / 4 }}>
              <TextField1
                id="StreetName"
                label="Street Name"
                onChange={handleInputChange}
              />
            </Stack>
            <Stack item sx={{ width: 1 / 4 }}>
              <TextField1 id="City" label="City" onChange={handleInputChange} />
            </Stack>
            <Stack item sx={{ width: 1 / 4 }}>
              <TextField1
                id="State"
                label="State"
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
                Update Supplier
              </Button>
            </Stack>
          </Stack>
        </Box>
      </form>
    </Box>
  );
};

export default UpdateSupplier;

// const StackRow = (props) => {
//     return <Stack item></Stack>
// }
const TextField1 = (props) => {
  return <TextField {...props} size="small" variant="outlined" />;
};
