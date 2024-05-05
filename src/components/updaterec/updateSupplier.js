import React, { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import _ from "lodash";

import { PaimsForm, FormSubheadered, FormRow } from "../paimsform/paimsForm";
import SmallTextField from "../paimsform/smallTextField";
import SubmitButton from "../paimsform/submitButton";
// import { autofillSupplierData } from "../../fetchutils/formautofill";
import { fetchSupplierAutofill } from "../../fetchutils/formautofill2";

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

  const [oldData, setOldData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const supplierForUseEffect = formData.SupplierID;
  useEffect(() => {
    const autofillSupplierData = async () => {
      const supplierAutofillData = await fetchSupplierAutofill(formData.SupplierID);
      if (!!supplierAutofillData) {
        const supData = supplierAutofillData;
        setFormData((prevData) => ({
          ...prevData,
          City: supData.City,
          State: supData.State,
          StreetName: supData.StreetName,
          SupplierContact: supData.SupplierContact,
          SupplierName: supData.SupplierName,
          UnitNumber: parseInt(supData.UnitNumber),
        }));
        setOldData(supData);
      }
      setOldData({});
    };

    autofillSupplierData();
  }, [supplierForUseEffect]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    // gatherFormErrors();
    // console.log(formErrors);
  };

  const gatherFormErrors = () => {
    // SupplierContact: "",
    // UnitNumber: "",
    // StreetName: "",
    // City: "",
    // State: "",
    // SupplierID: "",
    // SupplierName: "",
    const unchanged = _.isEqual(oldData, formData);
    console.log(formData, oldData);
    const contactNumberError = /^\d+$/.test(formData.SupplierContact) ? null : "Numbers only.";
    const unitNumberError = /^\d+$/.test(formData.UnitNumber) ? null : "Numbers only.";
    const newErrors = { ...formErrors, unchanged: unchanged, SupplierContact: contactNumberError, UnitNumber: unitNumberError };
    const filteredErrors = Object.fromEntries(Object.entries(newErrors).filter(([_, value]) => !!!value));
    console.log("new errors", newErrors);
    // console.log(contactNumberError);
    setFormErrors(filteredErrors);
  };

  // const formHasNoErrors = () => {
  //   return Object.keys(formErrors) === 0;
  // };

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
