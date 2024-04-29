import React from "react";
import { Box } from "@mui/material";
import FormHeader from "./formHeader";

/* TOP-DOWN DESIGN APPROACH: make PaimsForm first
 * props expectation (user story)
 * "I want a component that can have FormRow/FormSubheader as children."
 * "I also want that I am the one who will supply Components to FormRow."
 */

// Testing. Import subcomps to make UpdateSup form
// import FormSubheader from "./FormSubheader";
// import FormRow from "./FormRow";
// import SmallTextField from "./SmallTextField";
// import SubmitButton from "./SubmitButton";

// const header = "Update a Supplier in the Database";
// const somerow = (
//   <FormRow segments={3}>
//     <SmallTextField id="SupplierID" label="Supplier ID" pattern="[0-9]*" title="Numbers only." />
//     <SmallTextField id="SupplierName" label="Supplier Name" />
//     <SmallTextField id="SupplierContact" label="Contact Number" pattern="[0-9]*" />
//   </FormRow>
// );
// const somerow2 = (
//   <FormRow segments={4}>
//     <SmallTextField id="UnitNumber" label="Unit Number" />
//     <SmallTextField id="StreetName" label="Street" />
//     <SmallTextField id="City" label="Cty" />
//     <SmallTextField id="State" label="State" />
//   </FormRow>
// );
// const children = (
//   <>
//     <FormSubheader subheader="Supplier Details" />
//     {somerow}
//     <FormSubheader subheader="Supplier Address" />
//     {somerow2}
//     <SubmitButton text="Update Supplier" />
//   </>
// );

const PaimsForm = ({ header, children, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <Box display="flex" flexDirection="column">
        <FormHeader header={header} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2, borderStyle: "solid", borderColor: "#e5e5e5" }}>{children}</Box>
      </Box>
    </form>
  );
};

export default PaimsForm;
