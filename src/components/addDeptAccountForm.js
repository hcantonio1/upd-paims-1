import React, { useState } from "react";
import { Button } from "@mui/material";
import { Box, TextField } from "@mui/material";
import { createDepartmentAccount } from "../services/admin_funcs";

const AddDeptAccountForm = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [formData, setFormData] = useState({
    role: "",
    email: "",
    password: "",
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
    <form onSubmit={handleSubmit}>
      <Box
        display="flex"
        flexDirection="row"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
      >
        <TextField1 id="role" label="Role" onChange={handleInputChange} />
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField1 id="email" label="Email" onChange={handleInputChange} />
        <TextField1
          id="password"
          label="Password"
          type="password"
          onChange={handleInputChange}
        />
        <TextField1
          id="firstname"
          label="First Name"
          onChange={handleInputChange}
        />
        <TextField1
          id="lastname"
          label="Last Name"
          onChange={handleInputChange}
        />
      </Box>
      <Button type="submit" variant="contained" size="small" color="success">
        Submit
      </Button>
    </form>
  );

  return (
    <>
      <Button variant="contained" onClick={buttonClick}>
        {collapsed ? "New Department Account" : "Hide Section"}
      </Button>
      {collapsed ? <></> : form}
    </>
  );
};

export default AddDeptAccountForm;

const TextField1 = (props) => {
  return <TextField {...props} variant="standard" required />;
};
