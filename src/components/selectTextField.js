import React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

function SelectTextField({ label, name, value, options, onChange, getFunc }) {
  return (
    <TextField
      select
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      sx={{ width: 300 }}
      required
    >
      {label === "Select Trustee" && (
        options.map((option, index) => (
          <MenuItem
            key={`Trustee_${index}`}
            value={option.UserID}>
            {getFunc(option)}
          </MenuItem>
        ))
      )}

      {label === "Select Category" && (
        options.map((option, index) => (
          <MenuItem
            key={`category_${index}`}
            value={option.CategoryID}>
            {option.CategoryName}
          </MenuItem>
        ))
      )}

      {label === "Select Status" && (
        options.map((option, index) => (
          <MenuItem
            key={`status${index}`}
            value={option.StatusID}>
            {option.StatusName}
          </MenuItem>
        ))
      )}

      {label === "Select Location" && (
        options.map((option, index) => (
          <MenuItem
            key={`location_${index}`}
            value={option.LocationID}>
            {getFunc(option)}
          </MenuItem>
        ))
      )}
    </TextField>
  );
}

export default SelectTextField;