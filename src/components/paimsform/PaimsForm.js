import React from "react";
import { Box, Typography } from "@mui/material";

// Testing. Import subcomps to make UpdateSup form
import FormSubheader from "./FormSubheader";

/* TOP-DOWN DESIGN APPROACH: make PaimsForm first
 * props expectation (user story)
 * "I want a component that can have FormRow/FormSubheader as children."
 * "I also want that I am the one who will supply Components to FormRow."
 */

const PaimsForm = (props) => {
  <Box display="flex" flexDirection="column">
    <FormSubheader subheader="Update a Supplier in the Database" />
    {props.children}
  </Box>;
};

export default PaimsForm;
