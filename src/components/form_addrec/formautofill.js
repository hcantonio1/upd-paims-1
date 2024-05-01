// we autofill document and supplier fields
import { db } from "../../../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import dayjs from "dayjs";

export const autoFillDocumentData = async (DocumentID, setDocLocked, setDocData) => {
  const fetchResult = await fetchDocumentData(DocumentID);
  if (!!fetchResult) {
    const docData = fetchResult.data();
    setDocLocked(true);
    setDocData((prevData) => ({
      ...prevData,
      DocumentType: docData.DocumentType,
      DateIssued: dayjs(docData.DateIssued.toDate()),
      IssuedBy: docData.IssuedBy,
      ReceivedBy: docData.ReceivedBy,
    }));
    return;
  }
  setDocLocked(false);
};

const fetchDocumentData = async (DocumentID) => {
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

export const autoFillSupplierData = async (rownum, SupplierID, setPropRowLocks, setPropertyRows) => {
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
