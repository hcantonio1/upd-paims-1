import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const FormSelect = (props) => {
  const { label, choiceValuePairs } = props;
  const smallLabel = label.charAt(0).toLowerCase() + label.slice(1);
  const inputLabelLabel = `select-${smallLabel}`;

  return (
    <FormControl>
      <InputLabel id={inputLabelLabel}>{label}</InputLabel>
      <Select {...props} size="small" labelId={inputLabelLabel}>
        {choiceValuePairs.map((choice, index) => (
          <MenuItem key={`${label}_${index}`} value={choice[1]}>
            {choice[0]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FormSelect;