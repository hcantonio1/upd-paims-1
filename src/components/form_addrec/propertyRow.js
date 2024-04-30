import React from "react";
import { Add, Close, West } from "@mui/icons-material";
import { Box, IconButton, Paper } from "@mui/material";
import SmallTextField from "../paimsform/smallTextField";
import { FormSubheadered, FormRow } from "../paimsform/paimsForm";

const PropertyRow = (props) => {
  const propRowData = props.propRowData;
  const itemSubheadered = (
    <FormSubheadered subheader="Item Details">
      <FormRow segments={3}>
        <SmallTextField
          id="PropertyID"
          label="Property ID"
          value={propRowData.PropertyID}
          onChange={handleInputChange}
          type="string"
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
          }}
          title="Numbers only."
          required
        />
        <SmallTextField id="PropertyName" label="Property Name" value={propRowData.PropertyName} onChange={handleInputChange} />
      </FormRow>
      <FormRow segments={4}>
        <AggregatedFormSelect id="TrusteeID" label="Trustee" value={propRowData.TrusteeID} onChange={handleInputChange} options={users} optionnamegetter={getFullName} />
        <AggregatedFormSelect id="CategoryID" label="Category" value={propRowData.CategoryID} onChange={handleInputChange} options={categories} />
        <AggregatedFormSelect id="StatusID" label="Status" value={propRowData.StatusID} onChange={handleInputChange} options={statuses} />
        <AggregatedFormSelect id="LocationID" label="Location" value={propRowData.LocationID} onChange={handleInputChange} options={locations} optionnamegetter={getFullLoc} />
      </FormRow>
    </FormSubheadered>
  );

  const poSubheadered = (
    <FormSubheadered subheader="Purchase Order">
      <FormRow segments={4}>
        <SmallTextField id="PurchaseOrderID" label="Purchase Order ID" value={propRowData.PurchaseOrderID} onChange={handleInputChange} pattern="[0-9]*" title="Numbers only." required />
        <SmallTextField
          id="TotalCost"
          label="Total Cost"
          value={propRowData.TotalCost}
          onChange={handleInputChange}
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
            min: "0",
            step: "any",
          }}
          title="Please enter a positive number."
          required
          readOnly={orderLocked}
        />
        <FormDatePicker
          label="Purchase Date"
          id="PurchaseDate"
          value={propRowData.PurchaseDate}
          //   onChange={(val) => {
          //     setInputData({
          //       ...inputData,
          //       PurchaseDate: val,
          //     });
          //   }}
        />
      </FormRow>
    </FormSubheadered>
  );
  const supplierSubheadered = (
    <FormSubheadered subheader="Supplier Details">
      <FormRow segments={3}>
        <SmallTextField id="SupplierID" label="Supplier ID" value={propRowData.SupplierID} onChange={handleInputChange} pattern="[0-9]*" title="Numbers only." required />
        <SmallTextField id="SupplierName" label="Supplier Name" value={propRowData.SupplierName} onChange={handleInputChange} readOnly={supLocked} required />
        <SmallTextField id="SupplierContact" label="Contact Number" value={propRowData.SupplierContact} onChange={handleInputChange} readOnly={supLocked} required />
      </FormRow>
      <FormRow segments={4}>
        <SmallTextField id="UnitNumber" label="Unit Number" value={propRowData.UnitNumber} onChange={handleInputChange} readOnly={supLocked} />
        <SmallTextField id="StreetName" label="Street Name" value={propRowData.StreetName} onChange={handleInputChange} readOnly={supLocked} />
        <SmallTextField id="City" label="City" value={propRowData.City} onChange={handleInputChange} readOnly={supLocked} />
        <SmallTextField id="State" label="State" value={propRowData.State} onChange={handleInputChange} readOnly={supLocked} />
      </FormRow>
    </FormSubheadered>
  );

  return (
    <Paper sx={{ p: 2, backgroundColor: "#f3f3f3" }}>
      <Box display="flex" flexDirection="row" justifyContent="end">
        <IconButton children={<Close />} variant="contained" color="error" />
      </Box>
      {itemSubheadered}
      {poSubheadered}
      {supplierSubheadered}
      <Box display="flex" flexDirection="row" justifyContent="end">
        <IconButton variant="contained" children={<West />} color="primary" />
        <IconButton variant="contained" children={<Add />} color="primary" />
      </Box>
    </Paper>
  );
};

export default PropertyRow;
