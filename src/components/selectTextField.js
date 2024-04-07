import React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const getFullName = (user) => {
  return `${user.FirstName} ${user.LastName}`;
};

function SelectTextField({ label, name, value, options, onChange }) {
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
      {name === "TrusteeID" && (
        options.map((option, index) => (
          <MenuItem 
          key={`Trustee_${index}`} 
          value={option.UserID}>
            {getFullName(option)}
          </MenuItem>
        ))
      )}
    </TextField>
  );
}

export default SelectTextField;
