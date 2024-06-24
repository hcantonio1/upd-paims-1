import React, { useEffect, useState } from "react";
import _ from "lodash";
import { db } from "../../../firebase-config";
import { doc, updateDoc } from "firebase/firestore";
import { fetchSupplierAutofill } from "../../fetchutils/formautofill";
import { PaimsForm, FormSubheadered, FormRow, SubmitButton } from "../paimsform/PaimsForm";
import SmallTextField from "../paimsform/smallTextField";

/* In the future, add a heading "Select Existing Supplier" dropdown component before the first heading, "Supplier Details" */

const emptySupplierErrors = { SupplierID: [], City: [], State: [], StreetName: [], SupplierContact: [], SupplierName: [], UnitNumber: [] };

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
  const [formErrors, setFormErrors] = useState(_.cloneDeep(emptySupplierErrors));

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
      const newFormErrors = _.cloneDeep(emptySupplierErrors);
      const isUnmodified = _.isEqual(originalSupplier, formData);
      if (formData.SupplierID && !/^\d+$/.test(formData.SupplierID)) newFormErrors.SupplierID.push("Numbers only");
      if (formData.SupplierContact && !/^\d+$/.test(formData.SupplierContact)) newFormErrors.SupplierContact.push("Numbers only");
      if (formData.UnitNumber && !/^\d+$/.test(formData.UnitNumber)) newFormErrors.UnitNumber.push("Numbers only");

      // an error but I want it green; push it last (see what supFieldHasError return as helpertext)
      if (isUnmodified) newFormErrors.SupplierID.push("unchanged");

      setFormErrors(newFormErrors);
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

  const supFieldHasError = (fieldID) => {
    // return helperText when it has error
    if (fieldID === "SupplierID") {
      const errTexts = formErrors.SupplierID;
      if (errTexts.length === 1 && errTexts[0] === "unchanged") return;
    }
    if (formErrors[fieldID].length === 0) return;
    return formErrors[fieldID][0];
  };

  const formHasErrors = () => {
    let count = 0;
    Object.values(formErrors).map((arr) => (count += arr.length));
    return count > 0;
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
            helperText={formErrors.SupplierID[0] === "unchanged" ? "Supplier found" : supFieldHasError("SupplierID")}
            color={formErrors.SupplierID[0] === "unchanged" ? "success" : supFieldHasError("SupplierID") ? "error" : "primary"}
          />
          <SmallTextField id="SupplierName" label="Supplier Name" value={formData.SupplierName} onChange={handleInputChange} required />
          <SmallTextField
            id="SupplierContact"
            label="Contact Number"
            value={formData.SupplierContact}
            onChange={handleInputChange}
            required
            error={!!supFieldHasError("SupplierContact")}
            helperText={supFieldHasError("SupplierContact")}
          />
        </FormRow>
      </FormSubheadered>
      <FormSubheadered subheader="Supplier Address">
        <FormRow segments={4}>
          <SmallTextField
            id="UnitNumber"
            label="Unit Number"
            value={formData.UnitNumber}
            onChange={handleInputChange}
            error={!!supFieldHasError("UnitNumber")}
            helperText={supFieldHasError("UnitNumber")}
          />
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
