import React from "react";

const FormDatePicker = (props) => {
  return (
    <>
      <label htmlFor={props.id} style={{ display: "inline-block", verticalAlign: "top" }}>
        Date Issued
      </label>
      <input {...props} type="date" style={{ display: "inline-block" }} />
    </>
  );
};

export default FormDatePicker;
