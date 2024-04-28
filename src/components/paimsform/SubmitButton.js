import React from "react";
import { Button, Stack } from "@mui/material";

const SubmitButton = (props) => {
  return (
    <Stack sx={{ display: "flex", flexDirection: "row", px: 1, mb: 2 }} alignItems="flex-start" justifyContent="flex-end">
      <Stack sx={{ width: 1 / 6 }}>
        <Button {...props} type="submit" variant="contained" size="small" color="success">
          {props.text}
        </Button>
      </Stack>
    </Stack>
  );
};

export default SubmitButton;
