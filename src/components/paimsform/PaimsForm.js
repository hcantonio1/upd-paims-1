import React from "react";
import { Box } from "@mui/material";

// Testing. Import subcomps to make UpdateSup form
import FormTitle from "./FormHeader";
import FormSubheader from "./FormSubheader";

/* TOP-DOWN DESIGN APPROACH: make PaimsForm first
 * props expectation (user story)
 * "I want a component that can have FormRow/FormSubheader as children."
 * "I also want that I am the one who will supply Components to FormRow."
 */

const formtitle = <FormTitle title="Update a Supplier in the Database" />;

const children = (
  <>
    <FormSubheader subheader="Supplier Details" />
  </>
);

const PaimsForm = () => {
  return (
    <form>
      <Box display="flex" flexDirection="column">
        {/* props.formtitle */}
        {formtitle}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2, borderStyle: "solid", borderColor: "#e5e5e5" }}>
          {/* props.children */}
          {children}
        </Box>
      </Box>
    </form>
  );
};

export default PaimsForm;
