import { DatePicker } from "@mui/x-date-pickers";
import React from "react";

const FormDatePicker = (props) => {
  return <DatePicker {...props} inputFormat="YYYY-MM-DD" slotProps={{ textField: { size: "small" } }} disableFuture />;
};

export default FormDatePicker;
