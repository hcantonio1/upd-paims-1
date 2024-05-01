import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";

import { PaimsForm, FormSubheadered, FormRow } from "../paimsform/paimsForm";
import SmallTextField from "../paimsform/smallTextField";
import SubmitButton from "../paimsform/submitButton";
import { autofillSupplierData } from "../../fetchutils/formautofill";

/* In the future, add a heading "Select Existing Supplier" dropdown component before the first heading, "Supplier Details" */

const UpdateSupplier = () => {
  const [formData, setFormData] = useState({
    SupplierContact: "",
    UnitNumber: "",
    StreetName: "",
    City: "",
    State: "",
    SupplierID: "",
    SupplierName: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    if (e.target.id === "SupplierID") {
      autofillSupplierData(e.target.value, setFormData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const supplierRef = doc(db, "supplier", formData.SupplierID);
      await updateDoc(supplierRef, {
        City: formData.City,
        State: formData.State,
        StreetName: formData.StreetName,
        SupplierContact: formData.SupplierContact.toString(),
        SupplierName: formData.SupplierName,
        UnitNumber: parseInt(formData.UnitNumber),
      });
      alert("Successfully updated supplier!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating supplier:", error);
      alert("Failed to update supplier.");
    }
  };

  return (
    <PaimsForm header="Update a Supplier in the Database" onSubmit={handleSubmit}>
      <FormSubheadered subheader="Supplier Details">
        <FormRow segments={3}>
          <SmallTextField id="SupplierID" label="Supplier ID" value={formData.SupplierID} onChange={handleInputChange} pattern="[0-9]*" title="Numbers only." required />
          <SmallTextField id="SupplierName" label="Supplier Name" value={formData.SupplierName} onChange={handleInputChange} required />
          <SmallTextField id="SupplierContact" label="Contact Number" value={formData.SupplierContact} onChange={handleInputChange} required />
        </FormRow>
      </FormSubheadered>
      <FormSubheadered subheader="Supplier Address">
        <FormRow segments={4}>
          <SmallTextField id="UnitNumber" label="Unit Number" value={formData.UnitNumber} onChange={handleInputChange} />
          <SmallTextField id="StreetName" label="Street Name" value={formData.StreetName} onChange={handleInputChange} />
          <SmallTextField id="City" label="City" value={formData.City} onChange={handleInputChange} />
          <SmallTextField id="State" label="State" value={formData.State} onChange={handleInputChange} />
        </FormRow>
      </FormSubheadered>
      <SubmitButton text="Update Supplier" />
    </PaimsForm>
  );
};

export default UpdateSupplier;
