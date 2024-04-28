import React from "react";

const FormFileUpload = (props) => {
  return (
    <>
      <label htmlFor="New File" style={{ display: "inline-block", verticalAlign: "top" }}>
        New File
      </label>
      <input {...props} type="file" style={{ display: "inline-block" }} />
    </>
  );
};

export default FormFileUpload;
