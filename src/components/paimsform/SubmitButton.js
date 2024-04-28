import React from "react";
import { Button, Stack } from "@mui/material";

const SubmitButton = ({ text }) => {
  return (
    <Stack sx={{ display: "flex", flexDirection: "row", px: 1, mb: 2 }} alignItems="flex-start" justifyContent="flex-end">
      <Stack item sx={{ width: 1 / 6 }}>
        <Button type="submit" variant="contained" size="small" color="success">
          {text}
        </Button>
      </Stack>
    </Stack>
  );
};

export default SubmitButton;
