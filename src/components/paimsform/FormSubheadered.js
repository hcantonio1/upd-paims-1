import React from "react";
import { Box, Divider, Typography } from "@mui/material";

const FormSubheadered = ({ children, subheader }) => {
  return (
    <Box display="flex" flexDirection="column" sx={{ gap: 1, mb: 1 }}>
      <Typography variant="h9" fontWeight={"bold"}>
        {subheader}
      </Typography>
      <Divider></Divider>
      {children}
    </Box>
  );
};

export default FormSubheadered;
