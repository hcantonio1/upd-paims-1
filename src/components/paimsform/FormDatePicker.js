import { DatePicker } from "@mui/x-date-pickers";
import React from "react";

const FormDatePicker = (props) => {
  return <DatePicker {...props} inputFormat="YYYY-MM-DD" slotProps={{ textField: { size: "small" } }} disableFuture />;
};

export default FormDatePicker;

export const HtmlFormDatePicker = (props) => {
  return (
    <>
      <label htmlFor={props.id} style={{ display: "inline-block", verticalAlign: "top" }}>
        Date Issued
      </label>
      <input {...props} type="date" style={{ display: "inline-block" }} />
    </>
  );
};
