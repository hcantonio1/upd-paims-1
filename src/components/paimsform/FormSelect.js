import React from "react";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";

export const FormSelect = (props) => {
  const { id, label, choicevaluepairs } = props;
  const smallLabel = label.charAt(0).toLowerCase() + label.slice(1);
  const inputLabelLabel = `select-${smallLabel}`;

  return (
    <FormControl id={id} size="small" error={!!props.error}>
      <InputLabel id={inputLabelLabel}>{label}</InputLabel>
      <Select {...props} name={id} labelId={inputLabelLabel}>
        {choicevaluepairs.map((choice, index) => (
          <MenuItem key={`${label}_${index}`} value={choice[1]}>
            {choice[0]}
          </MenuItem>
        ))}
      </Select>
      {props.error && <FormHelperText>{props.helpertext}</FormHelperText>}
    </FormControl>
  );
};

// this aggregation could be unmaintainable in the future
export const AggregatedFormSelect = (props) => {
  const { id, options } = props;
  const raw_id = id.split("_")[0];

  // only works when these IDs are the keys of the formData!!
  const choicevaluepairs =
    raw_id === "TrusteeID"
      ? options.map((option) => [getFullName(option), option.UserID])
      : raw_id === "StatusID"
      ? options.map((option) => [option.StatusName, option.StatusID])
      : raw_id === "CategoryID"
      ? options.map((option) => [option.CategoryName, option.CategoryID])
      : raw_id === "LocationID"
      ? options.map((option) => [getFullLoc(option), option.LocationID])
      : raw_id === "DocumentType"
      ? options.map((option) => [option.Type, option.Type])
      : ["IssuedBy", "ReceivedBy"].includes(raw_id)
      ? options.map((option) => [getFullName(option), option.Username])
      : null;

  return <FormSelect {...props} choicevaluepairs={choicevaluepairs} />;
};

const getFullName = (user) => {
  return `${user.FirstName} ${user.LastName}`;
};

const getFullLoc = (location) => {
  return `${location.Building} ${location.RoomNumber}`;
};
