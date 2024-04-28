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
