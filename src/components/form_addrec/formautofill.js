// we autofill document and supplier fields
import { db } from "../../../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import dayjs from "dayjs";

export const autoFillDocumentData = async (DocumentID, setDocLocked, setInputData) => {
  const fetchResult = await fetchDocumentData(DocumentID);
  if (fetchResult !== false) {
    const docData = fetchResult;
    setDocLocked(true);
    setInputData((prevData) => ({
      ...prevData,
      DocumentType: docData.DocumentType,
      DateIssued: dayjs(docData.DateIssued.toDate()),
      IssuedBy: docData.IssuedBy,
      ReceivedBy: docData.ReceivedBy,
    }));
  }
  if (fetchResult === false) {
    setDocLocked(false);
  }
};

const fetchDocumentData = async (DocumentID) => {
  try {
    const docRef = doc(db, "item_document", DocumentID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return false;
  } catch (error) {
    console.error("Error fetching document:", error);
  }
};

export const autoFillSupplierData = async (SupplierID, setSupLocked, setInputData) => {
  const fetchResult = await fetchSupplierData(SupplierID);
  if (fetchResult !== false) {
    const supData = fetchResult;
    setSupLocked(true);
    setInputData((prevData) => ({
      ...prevData,
      City: supData.City,
      State: supData.State,
      StreetName: supData.StreetName,
      SupplierContact: supData.SupplierContact,
      SupplierName: supData.SupplierName,
      UnitNumber: parseInt(supData.UnitNumber),
    }));
  }
  if (fetchResult === false) {
    setSupLocked(false);
  }
};

const fetchSupplierData = async (SupplierID) => {
  try {
    const supRef = doc(db, "supplier", SupplierID);
    const supSnap = await getDoc(supRef);
    if (supSnap.exists()) {
      return supSnap.data();
    }
    return false;
  } catch (error) {
    console.error("Error fetching supplier:", error);
  }
};
