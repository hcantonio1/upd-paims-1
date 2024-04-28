import React from "react";
import { Stack } from "@mui/material";
import { child } from "firebase/database";

// import SmallTextField from "./SmallTextField";

/* API
 * children
 * segments
 */
const FormRow = ({ children, segments, test }) => {
  const segmentWidth = 1 / segments;
  const childrens =
    children.constructor !== Array ? (
      <Stack item sx={{ width: segmentWidth }} key={`${child.id}_column1`}>
        {children}
      </Stack>
    ) : (
      <>
        {children.map((child, index) => {
          return (
            <Stack item sx={{ width: segmentWidth }} key={`${child.id}_column${index}`}>
              {child}
            </Stack>
          );
        })}
      </>
    );

  return <Stack sx={{ display: "flex", flexDirection: "row", px: 1, gap: 1, mb: 2 }}>{childrens}</Stack>;
};

export default FormRow;
