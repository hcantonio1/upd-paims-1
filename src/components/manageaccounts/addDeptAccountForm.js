import React, { useEffect, useState } from "react";
import { Box, TextField, Button, FormControl, InputLabel, MenuItem, Paper, Select } from "@mui/material";
import { createDepartmentAccount } from "../../services/admin_funcs";

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
          <FormControl sx={{ width: 1 / 2 }}>
            <InputLabel id="select-role">Role</InputLabel>
            <Select labelId="select-role" id="role" value={formData.role} label="Role" onChange={handleSelectRole}>
              <MenuItem value="Encoder">Encoder</MenuItem>
              <MenuItem value="Trustee">Trustee</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", flexDirection: "row", width: 1 / 2, gap: 2 }} noValidate autoComplete="off">
            <TextField1 sx={{ width: 1 / 2 }} id="firstname" label="First Name" onChange={handleInputChange} />
            <TextField1 sx={{ width: 1 / 2 }} id="lastname" label="Last Name" onChange={handleInputChange} />
          </Box>
          <Box width="50%">
            <TextField1 sx={{ width: 1 }} id="email" label="Email" onChange={handleInputChange} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", width: 1 / 2, gap: 2 }} noValidate autoComplete="off">
            <TextField1 sx={{ width: 1 / 2 }} id="password" label="Password" type="password" onChange={handleInputChange} />
            <TextField1
              sx={{ width: 1 / 2 }}
              id="confirm-password"
              label="Confirm Password"
              type="password"
              onChange={handleInputChange}
              error={!passwordsMatch && confirmPassChanged}
              helperText={confirmPassChanged ? (passwordsMatch ? "Passwords match" : "Passwords must match") : ""}
              color={confirmPassChanged ? (passwordsMatch ? "success" : "error") : "primary"}
            />
          </Box>
          <Button sx={{ width: 1 / 2 }} type="submit" variant="contained" size="small" color="success">
            Register {formData.role}
          </Button>
        </Box>
      </form>
    </Paper>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Button variant="contained" onClick={buttonClick} sx={{ width: 1 / 4 }}>
        {collapsed ? "New Department Account" : "Hide Section"}
      </Button>
      {collapsed ? <></> : form}
    </Box>
  );
};

export default AddDeptAccountForm;

const TextField1 = (props) => {
  return <TextField {...props} variant="standard" required />;
};
