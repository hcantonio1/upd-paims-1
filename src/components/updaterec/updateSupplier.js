import React, { useEffect, useState } from "react";
import _ from "lodash";
import { db } from "../../../firebase-config";
import { doc, updateDoc } from "firebase/firestore";
import { fetchSupplierAutofill } from "../../fetchutils/formautofill";
import { PaimsForm, FormSubheadered, FormRow } from "../paimsform/paimsForm";
import SmallTextField from "../paimsform/smallTextField";
import SubmitButton from "../paimsform/submitButton";

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

  const [originalSupplier, setOriginalSupplier] = useState({});
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const autofillSupplierData = async () => {
      const supplierAutofillData = await fetchSupplierAutofill(formData.SupplierID);
      if (!!supplierAutofillData) {
        const supData = { ...supplierAutofillData, SupplierID: supplierAutofillData.SupplierID.toString() };
        setFormData(supData);
        setOriginalSupplier(supData);
      } else {
        setOriginalSupplier({});
      }
    };
    if (formData.SupplierID) {
      autofillSupplierData();
    }
  }, [formData.SupplierID]);

  useEffect(() => {
    const gatherFormErrors = () => {
      const isUnmodified = _.isEqual(originalSupplier, formData);
      const contactNumberError = /^\d+$/.test(formData.SupplierContact) ? null : "Numbers only.";
      const unitNumberError = /^\d+$/.test(formData.UnitNumber) ? null : "Numbers only.";
      setFormErrors((previousErrors) => {
        const newErrors = { ...previousErrors, unchanged: isUnmodified, SupplierContact: contactNumberError, UnitNumber: unitNumberError };
        const filteredErrors = Object.fromEntries(Object.entries(newErrors).filter(([_, value]) => !!value));
        return filteredErrors;
      });
    };
    if (formData.SupplierContact !== "" || formData.UnitNumber !== "" || Object.keys(originalSupplier) > 0) {
      gatherFormErrors();
    }
  }, [formData, originalSupplier]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const formHasErrors = () => {
    return Object.keys(formErrors).length > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formHasErrors()) return;

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
          <SmallTextField
            id="SupplierID"
            label="Supplier ID"
            value={formData.SupplierID}
            onChange={handleInputChange}
            required
            InputProps={{ pattern: "[0-9]*", title: "Numbers only." }}
            helperText={formErrors.unchanged ? "Supplier found" : null}
            color={formErrors.unchanged ? "success" : "primary"}
          />
          <SmallTextField id="SupplierName" label="Supplier Name" value={formData.SupplierName} onChange={handleInputChange} required />
          <SmallTextField
            id="SupplierContact"
            label="Contact Number"
            value={formData.SupplierContact}
            onChange={handleInputChange}
            required
            error={!!formErrors.SupplierContact}
            helperText={formErrors.SupplierContact}
          />
        </FormRow>
      </FormSubheadered>
      <FormSubheadered subheader="Supplier Address">
        <FormRow segments={4}>
          <SmallTextField id="UnitNumber" label="Unit Number" value={formData.UnitNumber} onChange={handleInputChange} error={!!formErrors.UnitNumber} helperText={formErrors.UnitNumber} />
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
