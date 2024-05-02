// we autofill document and supplier fields, and also property fields in updaterec.js
import { db } from "../../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import dayjs from "dayjs";

export const autofillDocumentData = async (DocumentID, setDocData, setDocLocked = null) => {
  const fetchResult = await fetchDocumentData(DocumentID);
  if (!!fetchResult) {
    const docData = fetchResult.data();
    if (setDocLocked != null) setDocLocked(true);
    setDocData((prevData) => ({
      ...prevData,
      DocumentType: docData.DocumentType,
      DateIssued: dayjs(docData.DateIssued.toDate()),
      IssuedBy: docData.IssuedBy,
      ReceivedBy: docData.ReceivedBy,
      Link: docData.Link,
    }));
    return;
  }
  if (setDocLocked != null) setDocLocked(false);
};

const fetchDocumentData = async (DocumentID) => {
  if (DocumentID === "") return;
  try {
    const docRef = doc(db, "item_document", DocumentID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap;
    }
    return false;
  } catch (error) {
    console.error("Error fetching document:", error);
  }
};

export const autofillSupplierData = async (supplierID, setFormData, setSupLocked = null) => {
  const fetchResult = await fetchSupplierData(supplierID);
  if (!!fetchResult) {
    const supData = fetchResult.data();
    if (setSupLocked != null) setSupLocked(true);
    setFormData((prevData) => ({
      ...prevData,
      City: supData.City,
      State: supData.State,
      StreetName: supData.StreetName,
      SupplierContact: supData.SupplierContact,
      SupplierName: supData.SupplierName,
      UnitNumber: parseInt(supData.UnitNumber),
    }));
    return;
  }
  if (setSupLocked != null) setSupLocked(false);
};

export const autofillPropRowSupp = async (rownum, SupplierID, setPropRowLocks, setPropertyRows) => {
  const fetchResult = await fetchSupplierData(SupplierID);
  if (!!fetchResult) {
    const supData = fetchResult.data();
    setPropRowLocks((prevData) => {
      prevData[rownum].supLocked = true;
      return prevData;
    });
    setPropertyRows((prevData) => {
      const myRow = prevData[rownum];
      const myNewRow = {
        ...myRow,
        [`City_${rownum}`]: supData.City,
        [`State_${rownum}`]: supData.State,
        [`StreetName_${rownum}`]: supData.StreetName,
        [`SupplierContact_${rownum}`]: supData.SupplierContact,
        [`SupplierName_${rownum}`]: supData.SupplierName,
        [`UnitNumber_${rownum}`]: parseInt(supData.UnitNumber),
      };
      prevData[rownum] = myNewRow;
      // console.log(rownum, SupplierID, prevData);
      return prevData;
    });
    return;
  }
  setPropRowLocks((prevData) => {
    prevData[rownum].supLocked = false;
    return prevData;
  });
};

const fetchSupplierData = async (SupplierID) => {
  if (SupplierID === "") return;
  try {
    const supRef = doc(db, "supplier", SupplierID);
    const supSnap = await getDoc(supRef);
    if (supSnap.exists()) {
      return supSnap;
    }
    return false;
  } catch (error) {
    console.error("Error fetching supplier:", error);
  }
};

export const autofillPropertyData = async (PropertyID, setFormData, setPropLocked = null) => {
  const fetchResult = await fetchPropertyData(PropertyID);
  if (!!fetchResult) {
    const propData = fetchResult.data();
    if (setPropLocked != null) setPropLocked(true);
    setFormData((prevData) => ({
      ...prevData,
      LocationID: parseInt(propData.LocationID),
      StatusID: parseInt(propData.StatusID),
      TrusteeID: parseInt(propData.TrusteeID),
      VerNum: propData.VerNum,
      Documents: propData.Documents,
    }));
    return;
  }
  if (setPropLocked != null) setPropLocked(false);
};

const fetchPropertyData = async (PropertyID) => {
  if (PropertyID === "") return;
  try {
    const propRef = doc(db, "property", PropertyID);
    const propSnap = await getDoc(propRef);
    if (propSnap.exists()) {
      return propSnap;
    }
    return false;
  } catch (error) {
    console.error("Error fetching property:", error);
  }
};
