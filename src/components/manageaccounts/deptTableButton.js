import React, { useState } from "react";
import { Box, Button, Paper, Modal } from "@mui/material";
import { FormRow, FormSubheadered } from "../paimsform/PaimsForm";
import SmallTextField from "../paimsform/smallTextField";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";

const DeptTableButton = ({ fields, insertEntry, CustomForm, buttonText }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(fields);

  const handleOpen = (e) => setOpen(true);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await insertEntry(formData);
    setOpen(false);
  };

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
          <CustomForm formData={formData} handleSubmit={handleSubmit} handleInputChange={handleInputChange} />
        </Box>
      </Modal>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button variant="contained" onClick={handleOpen} sx={{ width: 1 / 3, backgroundColor: "#014421", marginLeft: "auto" }}>
          {open ? "Hide Section" : buttonText}
        </Button>
      </Box>
    </>
  );
};

export const StatusDeptTableButton = () => {
  return <DeptTableButton fields={fields.status} insertEntry={insertEntry.status} CustomForm={PropStatusForm} buttonText="New Property Status" />;
};
export const LocationDeptTableButton = () => {
  return <DeptTableButton fields={fields.location} insertEntry={insertEntry.location} CustomForm={LocationForm} buttonText="New Location" />;
};
export const SupplierDeptTableButton = () => {
  return <DeptTableButton fields={fields.supplier} insertEntry={insertEntry.supplier} CustomForm={SupplierForm} buttonText="New Supplier" />;
};

const fields = {
  supplier: { SupplierContact: "", UnitNumber: "", StreetName: "", City: "", State: "", SupplierID: "", SupplierName: "" },
  location: { LocationID: "", Building: "AECH", RoomNumber: "" },
  status: { StatusID: "", StatusName: "", StatusDesc: "" },
};

const insertEntry = {
  supplier: async function (formData) {
    await setDoc(doc(db, "supplier", `${formData.SupplierID}`), {
      SupplierID: parseInt(formData.SupplierID),
      City: formData.City,
      State: formData.State,
      StreetName: formData.StreetName,
      SupplierContact: formData.SupplierContact.toString(),
      SupplierName: formData.SupplierName,
      UnitNumber: parseInt(formData.UnitNumber),
    });
  },
  location: async function (formData) {
    await setDoc(doc(db, "item_location", `placeholder_loc${formData.LocationID}`), {
      LocationID: parseInt(formData.LocationID),
      Building: formData.Building,
      RoomNumber: parseInt(formData.RoomNumber),
    });
  },
  status: async function (formData) {
    await setDoc(doc(db, "status", `status${formData.StatusID}`), {
      StatusID: parseInt(formData.StatusID),
      StatusName: formData.StatusName,
      StatusDesc: formData.StatusDesc,
    });
  },
};

const SupplierForm = ({ formData, handleSubmit, handleInputChange }) => {
  return (
    <Paper sx={{ p: 2, backgroundColor: "#e5e5e5" }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <h2>Add New Supplier</h2>
          <FormSubheadered subheader="Supplier Details">
            <FormRow segments={3}>
              <SmallTextField id="SupplierID" label="Supplier ID" value={formData.SupplierID} onChange={handleInputChange} required />
              <SmallTextField id="SupplierName" label="Supplier Name" value={formData.SupplierName} onChange={handleInputChange} required />
              <SmallTextField id="SupplierContact" label="Contact Number" value={formData.SupplierContact} onChange={handleInputChange} required />
            </FormRow>
          </FormSubheadered>
          <FormSubheadered subheader="Supplier Address">
            <FormRow segments={4}>
              <SmallTextField id="UnitNumber" label="Unit Number" value={formData.UnitNumber} onChange={handleInputChange} />
              <SmallTextField id="StreetName" label="Street Name" value={formData.StreetName} onChange={handleInputChange} />
              <SmallTextField id="City" label="City" value={formData.City} onChange={handleInputChange} />
              <SmallTextField id="State" label="State" value={formData.State} onChange={handleInputChange} />
            </FormRow>
          </FormSubheadered>
          <Button type="submit" variant="contained" size="small" color="success">
            Submit
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

const LocationForm = ({ formData, handleSubmit, handleInputChange }) => {
  return (
    <Paper sx={{ p: 2, backgroundColor: "#e5e5e5" }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <h2>Add New Location</h2>
          <FormRow segments={1}>
            <SmallTextField id="Building" label="Building" value={formData.Building} onChange={handleInputChange} required />
          </FormRow>
          <FormRow segments={2}>
            <SmallTextField id="LocationID" label="ID" value={formData.LocationID} onChange={handleInputChange} required />
            <SmallTextField id="RoomNumber" label="Room Number" value={formData.RoomNumber} onChange={handleInputChange} required />
          </FormRow>
          <Button type="submit" variant="contained" size="small" color="success">
            Submit
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

const PropStatusForm = ({ formData, handleSubmit, handleInputChange }) => {
  return (
    <Paper sx={{ p: 2, backgroundColor: "#e5e5e5" }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <h2>Create Property Status</h2>
          <FormRow segments={2}>
            <SmallTextField id="StatusID" label="ID" value={formData.StatusID} onChange={handleInputChange} required />
            <SmallTextField id="StatusName" label="Name" value={formData.StatusName} onChange={handleInputChange} required />
          </FormRow>
          <FormRow segments={1}>
            <SmallTextField id="StatusDesc" label="Description" value={formData.StatusDesc} onChange={handleInputChange} />
          </FormRow>
          <Button type="submit" variant="contained" size="small" color="success">
            Submit
          </Button>
        </Box>
      </form>
    </Paper>
  );
};
