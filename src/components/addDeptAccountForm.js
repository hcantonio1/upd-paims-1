import React, { useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";
import { Box, TextField } from "@mui/material";
import { createDepartmentAccount } from "../services/admin_funcs";

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

  const buttonClick = (e) => {
    setCollapsed(!collapsed);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!["Encoder", "Trustee"].includes(formData.role)) {
      alert("Role must be either Encoder or Trustee");
      return;
    }
    createDepartmentAccount(formData);
  };

  const form = (
    <Paper sx={{ p: 2, backgroundColor: "#e5e5e5" }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ width: 1 / 4 }}>
          <InputLabel id="role">Role</InputLabel>
          <Select
            labelId="role"
            id="role"
            value={formData.role}
            label="Role"
            onChange={handleInputChange}
          >
            <MenuItem value="Encoder">Encoder</MenuItem>
            <MenuItem value="Trustee">Trustee</MenuItem>
          </Select>
        </FormControl>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: 1 / 2,
            gap: 2,
          }}
          noValidate
          autoComplete="off"
        >
          <TextField1
            sx={{ width: 1 / 2 }}
            id="firstname"
            label="First Name"
            onChange={handleInputChange}
          />
          <TextField1
            sx={{ width: 1 / 2 }}
            id="lastname"
            label="Last Name"
            onChange={handleInputChange}
          />
        </Box>
        <Box width="50%">
          <TextField1
            sx={{ width: 1 }}
            id="email"
            label="Email"
            onChange={handleInputChange}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: 1 / 2,
            gap: 2,
          }}
          noValidate
          autoComplete="off"
        >
          <TextField1
            sx={{ width: 1 / 2 }}
            id="password"
            label="Password"
            type="password"
            onChange={handleInputChange}
          />
          <TextField1
            sx={{ width: 1 / 2 }}
            id="confirm-password"
            label="Confirm Password"
            type="password"
            onChange={handleInputChange}
          />
        </Box>
        <Button type="submit" variant="contained" size="small" color="success">
          Register {formData.Role}
        </Button>
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
