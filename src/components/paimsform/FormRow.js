import React from "react";
import { Stack } from "@mui/material";
import { child } from "firebase/database";

// import SmallTextField from "./SmallTextField";

/* API
 * children
 * segments
 */
const FormRow = ({ children, segments }) => {
  const segmentWidth = 1 / segments;
  return (
    <Stack sx={{ display: "flex", flexDirection: "row", px: 1, gap: 1, mb: 2 }}>
      {children.map((child, index) => {
        return (
          <Stack item sx={{ width: segmentWidth }} key={`${child.id}_column${index}`}>
            {child}
          </Stack>
        );
      })}
    </Stack>
  );
};

export default FormRow;
