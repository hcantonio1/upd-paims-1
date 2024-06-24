import React from "react";
import { Box, Divider, Stack, Typography, Button } from "@mui/material";
// import FormHeader from "./formHeader";

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

export const PaimsForm = ({ header, children, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <Box display="flex" flexDirection="column">
        <FormHeader header={header} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2, borderStyle: "solid", borderColor: "#e5e5e5" }}>{children}</Box>
      </Box>
    </form>
  );
};

const FormHeader = ({ header }) => {
  return (
    <Box sx={{ backgroundColor: "#e5e5e5", padding: 1 }}>
      <Typography variant="h9" fontWeight={"bold"}>
        {header}
      </Typography>
    </Box>
  );
};

export const FormSubheadered = ({ children, subheader }) => {
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

// API: children, segments
export const FormRow = ({ children, segments, test }) => {
  const segmentWidth = 1 / segments;
  const childrens =
    children.constructor !== Array ? (
      <Stack sx={{ width: segmentWidth }} key={`${children.id}_column1`}>
        {children}
      </Stack>
    ) : (
      <>
        {children.map((child, index) => {
          return (
            <Stack sx={{ width: segmentWidth }} key={`${child.id}_column${index}`}>
              {child}
            </Stack>
          );
        })}
      </>
    );

  return <Stack sx={{ display: "flex", flexDirection: "row", px: 1, gap: 1 }}>{childrens}</Stack>;
};

export const SubmitButton = (props) => {
  return (
    <Stack sx={{ display: "flex", flexDirection: "row", px: 1, mb: 2 }} alignItems="flex-start" justifyContent="flex-end">
      <Stack sx={{ width: 1 / 6 }}>
        <Button {...props} type="submit" variant="contained" size="small" sx={{ color: 'white', bgcolor: '#014421', '&:hover': { bgcolor: '#dea80f' }}}>
          {props.text}
        </Button>
      </Stack>
    </Stack>
  );
};
