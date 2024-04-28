import React from "react";
import { Divider, Typography } from "@mui/material";

const FormSubheader = ({ subheader }) => {
  return (
    <>
      <Typography variant="h9" fontWeight={"bold"}>
        {subheader}
      </Typography>
      <Divider></Divider>
    </>
  );
};

export default FormSubheader;
