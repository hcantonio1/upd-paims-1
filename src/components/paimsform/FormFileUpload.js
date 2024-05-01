import { CloudUpload } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";

export const FormFileUpload = (props) => {
  const text = props.f ?? "Upload file";
  const muisample = (
    <>
      <input {...props} type="file" style={{ display: "none" }} />
      <label htmlFor={props.id} style={{ display: "inline-block", verticalAlign: "top" }}>
        <Button variant="contained" tabIndex={-1} startIcon={<CloudUpload />}>
          {text}
        </Button>
      </label>
    </>
  );
  return <HtmlFormFileUpload {...props}></HtmlFormFileUpload>;
};

export const HtmlFormFileUpload = (props) => {
  return (
    <>
      <label htmlFor="New File" style={{ display: "inline-block", verticalAlign: "top" }}>
        New File
      </label>
      <input {...props} type="file" style={{ display: "inline-block" }} />
    </>
  );
};
