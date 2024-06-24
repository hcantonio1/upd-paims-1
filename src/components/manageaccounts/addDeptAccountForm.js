import React, { useEffect, useState } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Modal } from "@mui/material";
import { createDepartmentAccount } from "../../services/admin_funcs";
import { FormRow } from "../paimsform/PaimsForm";
import SmallTextField from "../paimsform/smallTextField";

const AddDeptAccountForm = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [formData, setFormData] = useState({
    role: "",
    email: "",
    password: "",
    "confirm-password": "",
    firstname: "",
    lastname: "",
  });
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [confirmPassChanged, setConfirmPassChanged] = useState(false);

  // useEffect extracted variables
  const passwordField = formData.password;
  const confirmPasswordField = formData["confirm-password"];
  useEffect(() => {
    if (confirmPasswordField) {
      setConfirmPassChanged(true);
      setPasswordsMatch(passwordField === confirmPasswordField);
    }
  }, [passwordField, confirmPasswordField]);

  const buttonClick = (e) => {
    setCollapsed(!collapsed);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSelectRole = (e) => {
    setFormData({
      ...formData,
      role: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData["confirm-password"]) {
      alert("Passwords don't match.");
      return;
    }
    createDepartmentAccount(formData);
  };

  const form = (
    <Paper sx={{ p: 2, backgroundColor: "#e5e5e5" }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <h2>Create Account</h2>
          <FormRow segments={1}>
            <FormControl>
              <InputLabel id="select-role">Role</InputLabel>
              <Select labelId="select-role" id="role" value={formData.role} label="Role" onChange={handleSelectRole}>
                <MenuItem value="Encoder">Encoder</MenuItem>
                <MenuItem value="Trustee">Trustee</MenuItem>
              </Select>
            </FormControl>
          </FormRow>
          <FormRow segments={2}>
            <SmallTextField id={`firstname`} label="First Name" onChange={handleInputChange} />
            <SmallTextField id={`lastname`} label="Last Name" onChange={handleInputChange} />
          </FormRow>
          <FormRow segments={1}>
            <SmallTextField id={`email`} label="Email" onChange={handleInputChange} />
          </FormRow>
          <FormRow segments={2}>
            <SmallTextField id={`password`} label="Password" type="password" onChange={handleInputChange} />
            <SmallTextField
              id="confirm-password"
              label="Confirm Password"
              type="password"
              onChange={handleInputChange}
              error={!passwordsMatch && confirmPassChanged}
              helperText={confirmPassChanged ? (passwordsMatch ? "Passwords match" : "Passwords must match") : ""}
              color={confirmPassChanged ? (passwordsMatch ? "success" : "error") : "primary"}
            />
          </FormRow>
          <Button type="submit" variant="contained" size="small" color="success">
            Register {formData.role}
          </Button>{" "}
        </Box>
      </form>
    </Paper>
  );

  return (
    <>
      <Modal open={!collapsed} onClose={() => setCollapsed(true)}>
        <Box sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>{form}</Box>
      </Modal>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button variant="contained" onClick={buttonClick} sx={{ width: 1 / 3, backgroundColor: "#014421", marginLeft: "auto" }}>
          {collapsed ? "New Department Account" : "Hide Section"}
        </Button>
      </Box>
    </>
  );
};

export default AddDeptAccountForm;
