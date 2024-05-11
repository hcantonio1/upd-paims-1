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

export const fetchPOAutofill = async (poID) => {
  if (poID === "") return;
  try {
    const poRef = doc(db, "purchase_order", poID);
    const poSnap = await getDoc(poRef);
    if (poSnap.exists()) {
      return poSnap.data();
    }
  } catch (error) {
    console.error("Error fetching PO autofill:", error);
  }
  return null;
};
