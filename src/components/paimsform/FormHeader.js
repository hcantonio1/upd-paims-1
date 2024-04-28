import React from "react";
import { Box, Typography } from "@mui/material";

const FormHeader = ({ header }) => {
  return (
    <Box sx={{ backgroundColor: "#e5e5e5", padding: 1 }}>
      <Typography variant="h9" fontWeight={"bold"}>
        {header}
      </Typography>
    </Box>
  );
};

export default FormHeader;
