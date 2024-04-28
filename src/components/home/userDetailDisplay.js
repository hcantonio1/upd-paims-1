import React from "react";
import { Box, Typography } from "@mui/material";

const UserDetailDisplay = ({ IconComponent, entryLabel, entryValue }) => {
  return (
    <Box display="flex" flexDirection="row" sx={{ bgcolor: "#e5e5e5", p: 1 }}>
      <IconComponent />
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            mx: 1,
          }}
        >
          {entryLabel}:
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6">{entryValue}</Typography>
      </Box>
    </Box>
  );
};

export default UserDetailDisplay;
