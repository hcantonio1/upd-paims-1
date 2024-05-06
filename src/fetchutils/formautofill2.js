// we autofill document and supplier fields, and also property fields in updaterec.js
import { db } from "../../firebase-config";
import { doc, getDoc } from "firebase/firestore";

export const fetchSupplierAutofill = async (supplierID) => {
  if (supplierID === "") return;
  try {
    const supRef = doc(db, "supplier", supplierID);
    const supSnap = await getDoc(supRef);
    if (supSnap.exists()) {
      return supSnap.data();
    }
  } catch (error) {
    console.error("Error fetching supplier autofill:", error);
  }
  return null;
};

export const fetchDocumentAutofill = async (documentID) => {
  if (documentID === "") return;
  try {
    const docRef = doc(db, "item_document", documentID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (error) {
    console.error("Error fetching document autofill:", error);
  }
  return null;
};

export const fetchPropertyAutofill = async (propertyID) => {
  if (propertyID === "") return;
  try {
    const propRef = doc(db, "property", propertyID);
    const propSnap = await getDoc(propRef);
    if (propSnap.exists()) {
      return propSnap.data();
    }
  } catch (error) {
    console.error("Error fetching property autofill:", error);
  }
  return null;
};

// const suppliersForUseEffect = propertyRows.map((propRowData, index) => propRowData[`SupplierID_${index}`]);
// useEffect(() => {
//   const propertyRowWithSuppData = async (propRowData, index) => {
//     const supplierID = propRowData.SupplierID;
//     const supplierAutofillData = await fetchSupplierAutofill(supplierID);
//     if (supplierAutofillData == null) {
//       console.log("does this happen");
//       console.log(propRowData);
//       return propRowData;
//     } else {
//       // let's expect a supplier object
//       console.log("does this happen2");

//       const { SupplierContact, UnitNumber, StreetName, City, State, SupplierName } = supplierAutofillData;
//       console.log(supplierAutofillData);
//       const newPropRowData = {
//         ...propRowData,
//         [`SupplierContact_${index}`]: SupplierContact,
//         [`UnitNumber_${index}`]: UnitNumber,
//         [`StreetName_${index}`]: StreetName,
//         [`City_${index}`]: City,
//         [`State_${index}`]: State,
//         [`SupplierName_${index}`]: SupplierName,
//       };
//       return newPropRowData;
//     }
//   };

//   const autofillPropertyRowSuppliers = async () => {
//     const newPropertyRows = [];
//     propertyRows.forEach((propRowData, index) => {
//       newPropertyRows.push(propertyRowWithSuppData(propRowData, index));
//     });
//     await Promise.all(newPropertyRows);
//     console.log(newPropertyRows);
//     setPropertyRows(newPropertyRows);
//   };

//   autofillPropertyRowSuppliers();
// }, suppliersForUseEffect);
