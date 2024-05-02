import { CloudUpload } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";

export const FormFileUpload = (props) => {
  const text = props.filename ?? "Upload Document";
  return (
    <>
      <input {...props} type="file" style={{ display: "none" }} />
      <label htmlFor={props.id}>
        <Button sx={{ width: 1 }} component="span" variant="contained" tabIndex={-1} startIcon={<CloudUpload />} disabled={props.disabled}>
          {text}
        </Button>
      </label>
    </>
  );
};
