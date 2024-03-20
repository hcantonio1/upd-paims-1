import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Box, TextField } from "@mui/material";

const AddDeptAccountForm = () => {
  const [collapsed, setCollapsed] = useState(true);

  const buttonClick = (e) => {
    setCollapsed(!collapsed);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const form = (
    <form onSubmit={handleSubmit}>
      <Box
        component="container"
        display="flex"
        flexDirection="row"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField id="role" label="Role" variant="standard" />
      </Box>
      <Box
        component="container"
        display="flex"
        flexDirection="row"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField id="email" label="Email" variant="standard" />
        <TextField id="password" label="Password" variant="standard" />
        <TextField id="firstname" label="First Name" variant="standard" />
        <TextField id="lastname" label="Last Name" variant="standard" />
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
