import React, { useState } from "react";
import { Button } from "@mui/material";

const AddDeptAccountForm = () => {
  const [collapsed, setCollaped] = useState(true);

  return collapsed ? (
    <Button variant="contained">Add New Account</Button>
  ) : (
    <></>
  );
};

export default AddDeptAccountForm;
