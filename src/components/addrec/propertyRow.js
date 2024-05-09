import React from "react";
import { FormSubheadered, FormRow } from "../paimsform/paimsForm";
import SmallTextField from "../paimsform/smallTextField";
import FormDatePicker from "../paimsform/formDatePicker";
import { AggregatedFormSelect } from "../paimsform/formSelect";
import { IconButton } from "@mui/material";
import { Add, Close, East, West } from "@mui/icons-material";

const PropertyRow = ({ propRowData, handleChange, locks, ...rest }) => {
  const { supLocked, orderLocked } = locks;

  const handleInputChange = handleChange;
  const { users, categories, statuses, locations } = rest.dropdowndata;

  const itemSubheadered = (
    <FormSubheadered subheader="Item Details">
      <FormRow segments={3}>
        <SmallTextField
          id={`PropertyID`}
          label="Property ID"
          value={propRowData[`PropertyID`]}
          onChange={handleInputChange}
          type="string"
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
          }}
          title="Numbers only."
          required
        />
        <SmallTextField id={`PropertyName`} label="Property Name" value={propRowData[`PropertyName`]} onChange={handleInputChange} />
      </FormRow>
      <FormRow segments={4}>
        <AggregatedFormSelect id={`TrusteeID`} label="Trustee" value={propRowData[`TrusteeID`]} onChange={handleInputChange} options={users} />
        <AggregatedFormSelect id={`CategoryID`} label="Category" value={propRowData[`CategoryID`]} onChange={handleInputChange} options={categories} />
        <AggregatedFormSelect id={`StatusID`} label="Status" value={propRowData[`StatusID`]} onChange={handleInputChange} options={statuses} />
        <AggregatedFormSelect id={`LocationID`} label="Location" value={propRowData[`LocationID`]} onChange={handleInputChange} options={locations} />
      </FormRow>
    </FormSubheadered>
  );

  const poSubheadered = (
    <FormSubheadered subheader="Purchase Order">
      <FormRow segments={4}>
        <SmallTextField id={`PurchaseOrderID`} label="Purchase Order ID" value={propRowData[`PurchaseOrderID`]} onChange={handleInputChange} required />
        <SmallTextField
          id={`TotalCost`}
          label="Total Cost"
          value={propRowData[`TotalCost`]}
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
        <FormDatePicker label="Purchase Date" id={`PurchaseDate`} value={propRowData[`PurchaseDate`]} onChange={rest.podatepickerfunc} />
      </FormRow>
    </FormSubheadered>
  );
  const supplierSubheadered = (
    <FormSubheadered subheader="Supplier Details">
      <FormRow segments={3}>
        <SmallTextField id={`SupplierID`} label="Supplier ID" value={propRowData[`SupplierID`]} onChange={handleInputChange} pattern="[0-9]*" title="Numbers only." required />
        <SmallTextField id={`SupplierName`} label="Supplier Name" value={propRowData[`SupplierName`]} onChange={handleInputChange} readOnly={supLocked} required />
        <SmallTextField id={`SupplierContact`} label="Contact Number" value={propRowData[`SupplierContact`]} onChange={handleInputChange} readOnly={supLocked} required />
      </FormRow>
      <FormRow segments={4}>
        <SmallTextField id={`UnitNumber`} label="Unit Number" value={propRowData[`UnitNumber`]} onChange={handleInputChange} readOnly={supLocked} />
        <SmallTextField id={`StreetName`} label="Street Name" value={propRowData[`StreetName`]} onChange={handleInputChange} readOnly={supLocked} />
        <SmallTextField id={`City`} label="City" value={propRowData[`City`]} onChange={handleInputChange} readOnly={supLocked} />
        <SmallTextField id={`State`} label="State" value={propRowData[`State`]} onChange={handleInputChange} readOnly={supLocked} />
      </FormRow>
    </FormSubheadered>
  );

  return (
    <>
      {itemSubheadered}
      {poSubheadered}
      {supplierSubheadered}
    </>
  );
};

export default PropertyRow;

export const NextPropRowButton = (props) => <IconButton {...props} variant="contained" children={<East />} color="primary" />;
export const AddPropRowButton = (props) => <IconButton {...props} variant="contained" children={<Add />} color="primary" />;
export const PrevPropRowButton = (props) => <IconButton {...props} variant="contained" children={<West />} color="primary" />;
export const DeletePropRowButton = (props) => <IconButton {...props} variant="contained" children={<Close />} color="error" />;
