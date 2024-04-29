import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const FormSelect = (props) => {
  const { id, label, choicevaluepairs } = props;
  const smallLabel = label.charAt(0).toLowerCase() + label.slice(1);
  const inputLabelLabel = `select-${smallLabel}`;

  return (
    <FormControl id={id} size="small">
      <InputLabel id={inputLabelLabel}>{label}</InputLabel>
      <Select {...props} name={id} labelId={inputLabelLabel}>
        {choicevaluepairs.map((choice, index) => (
          <MenuItem key={`${label}_${index}`} value={choice[1]}>
            {choice[0]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FormSelect;

// this aggregation could be unmaintainable in the future
export const AggregatedFormSelect = (props) => {
  const { id, label, options, optionnamegetter: getOptionName } = props;

  // only works when these IDs are the keys of the formData!!
  const choicevaluepairs =
    id === "TrusteeID"
      ? options.map((option) => [getOptionName(option), option.UserID])
      : id === "StatusID"
      ? options.map((option) => [option.StatusName, option.StatusID])
      : id === "CategoryID"
      ? options.map((option) => [option.CategoryName, option.CategoryID])
      : id === "LocationID"
      ? options.map((option) => [getOptionName(option), option.LocationID])
      : id === "DocumentType"
      ? options.map((option) => [option.Type, option.Type])
      : ["IssuedBy", "ReceivedBy"].includes(id)
      ? options.map((option) => [getOptionName(option), option.Username])
      : null;

  return <FormSelect {...props} choicevaluepairs={choicevaluepairs} />;
};
