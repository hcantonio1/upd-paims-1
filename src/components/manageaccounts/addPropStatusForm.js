import React, { useEffect, useState } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Modal } from "@mui/material";
import { FormRow, PaimsForm } from "../paimsform/PaimsForm";
import SmallTextField from "../paimsform/smallTextField";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";

export const AddPropStatusForm = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    StatusID: "",
    StatusName: "",
    StatusDesc: "",
  });

  const handleOpen = (e) => setOpen(true);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, "status", `status${formData.StatusID}`), {
      StatusID: parseInt(formData.StatusID),
      StatusName: formData.StatusName,
      StatusDesc: formData.StatusDesc,
    });
    setOpen(false);
  };

  const form = (
    <Paper sx={{ p: 2, backgroundColor: "#e5e5e5" }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <h2>Create Property Status</h2>
          <FormRow segments={2}>
            <SmallTextField id="StatusID" label="ID" value={formData.StatusID} onChange={handleInputChange} />
            <SmallTextField id="StatusName" label="Name" value={formData.StatusName} onChange={handleInputChange} />
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

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>{form}</Box>
      </Modal>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button variant="contained" onClick={handleOpen} sx={{ width: 1 / 3, backgroundColor: "#014421", marginLeft: "auto" }}>
          {open ? "Hide Section" : "New Property Status"}
        </Button>
      </Box>
    </>
  );
};
