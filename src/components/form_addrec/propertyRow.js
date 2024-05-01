import React, { useState } from "react";
import { FormSubheadered, FormRow } from "../paimsform/paimsForm";
import SmallTextField from "../paimsform/smallTextField";
import FormDatePicker from "../paimsform/formDatePicker";
import { AggregatedFormSelect } from "../paimsform/formSelect";

const PropertyRow = ({ rownum, propRowData, handleChange, ...rest }) => {
  const [supLocked, setSupLocked] = useState(false);
  const [orderLocked, setOrderLocked] = useState(false);

  const handleInputChange = handleChange;
  const { users, categories, statuses, locations } = rest.dropdowndata;

  const itemSubheadered = (
    <FormSubheadered subheader="Item Details">
      <FormRow segments={3}>
        <SmallTextField
          id={`PropertyID_${rownum}`}
          label="Property ID"
          value={propRowData[`PropertyID_${rownum}`]}
          onChange={handleInputChange}
          type="string"
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
          }}
          title="Numbers only."
          required
        />
        <SmallTextField id={`PropertyName_${rownum}`} label="Property Name" value={propRowData[`PropertyName_${rownum}`]} onChange={handleInputChange} />
      </FormRow>
      <FormRow segments={4}>
        <AggregatedFormSelect id={`TrusteeID_${rownum}`} label="Trustee" value={propRowData[`TrusteeID_${rownum}`]} onChange={handleInputChange} options={users} />
        <AggregatedFormSelect id={`CategoryID_${rownum}`} label="Category" value={propRowData[`CategoryID_${rownum}`]} onChange={handleInputChange} options={categories} />
        <AggregatedFormSelect id={`StatusID_${rownum}`} label="Status" value={propRowData[`StatusID_${rownum}`]} onChange={handleInputChange} options={statuses} />
        <AggregatedFormSelect id={`LocationID_${rownum}`} label="Location" value={propRowData[`LocationID_${rownum}`]} onChange={handleInputChange} options={locations} />
      </FormRow>
    </FormSubheadered>
  );

  const poSubheadered = (
    <FormSubheadered subheader="Purchase Order">
      <FormRow segments={4}>
        <SmallTextField id={`PurchaseOrderID_${rownum}`} label="Purchase Order ID" value={propRowData[`PurchaseOrderID_${rownum}`]} onChange={handleInputChange} required />
        <SmallTextField
          id={`TotalCost_${rownum}`}
          label="Total Cost"
          value={propRowData[`TotalCost_${rownum}`]}
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
        <FormDatePicker label="Purchase Date" id={`PurchaseDate_${rownum}`} value={propRowData[`PurchaseDate_${rownum}`]} onChange={rest.podatepickerfunc} />
      </FormRow>
    </FormSubheadered>
  );
  const supplierSubheadered = (
    <FormSubheadered subheader="Supplier Details">
      <FormRow segments={3}>
        <SmallTextField id={`SupplierID_${rownum}`} label="Supplier ID" value={propRowData[`SupplierID_${rownum}`]} onChange={handleInputChange} pattern="[0-9]*" title="Numbers only." required />
        <SmallTextField id={`SupplierName_${rownum}`} label="Supplier Name" value={propRowData[`SupplierName_${rownum}`]} onChange={handleInputChange} readOnly={supLocked} required />
        <SmallTextField id={`SupplierContact_${rownum}`} label="Contact Number" value={propRowData[`SupplierContact_${rownum}`]} onChange={handleInputChange} readOnly={supLocked} required />
      </FormRow>
      <FormRow segments={4}>
        <SmallTextField id={`UnitNumber_${rownum}`} label="Unit Number" value={propRowData[`UnitNumber_${rownum}`]} onChange={handleInputChange} readOnly={supLocked} />
        <SmallTextField id={`StreetName_${rownum}`} label="Street Name" value={propRowData[`StreetName_${rownum}`]} onChange={handleInputChange} readOnly={supLocked} />
        <SmallTextField id={`City_${rownum}`} label="City" value={propRowData[`City_${rownum}`]} onChange={handleInputChange} readOnly={supLocked} />
        <SmallTextField id={`State_${rownum}`} label="State" value={propRowData[`State_${rownum}`]} onChange={handleInputChange} readOnly={supLocked} />
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
