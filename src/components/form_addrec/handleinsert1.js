import { db, storage } from "../../../firebase-config";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "@firebase/storage";

export const handleSubmit = async (e, inputData) => {
  e.preventDefault();

  const { DocumentID, DocumentType, DateIssued, IssuedBy, ReceivedBy, Link, ...propRowData } = inputData;
  console.log(propRowData);

  await insertPropRow(e, propRowData, inputData.DocumentID);
  await insertDocument(e, inputData);
};

const insertPropRow = async (e, propRowData, documentID) => {
  e.preventDefault();

  // if (propRowData.IssuedBy === propRowData.ReceivedBy) {
  //   alert("IssuedBy and ReceivedBy cannot be the same user.");
  //   return;
  // }

  try {
    await setDoc(doc(db, "supplier", propRowData.SupplierID), {
      City: propRowData.City,
      State: propRowData.State,
      StreetName: propRowData.StreetName,
      SupplierContact: propRowData.SupplierContact.toString(),
      SupplierID: parseInt(propRowData.SupplierID),
      SupplierName: propRowData.SupplierName,
      UnitNumber: parseInt(propRowData.UnitNumber),
    });

    var docObject = {};
    docObject[propRowData.TrusteeID] = documentID;
    await setDoc(doc(db, "property", propRowData.PropertyID), {
      CategoryID: parseInt(propRowData.CategoryID),
      DocumentID: docObject,
      isArchived: 0,
      isApproved: 0,
      LocationID: parseInt(propRowData.LocationID),
      PropertyID: parseInt(propRowData.PropertyID),
      PropertyName: propRowData.PropertyName,
      TrusteeID: parseInt(propRowData.TrusteeID),
      StatusID: parseInt(propRowData.StatusID),
      SupplierID: parseInt(propRowData.SupplierID),
      PurchaseOrderID: parseInt(propRowData.PurchaseOrderID),
    });
    await setDoc(doc(db, "purchase_order", propRowData.PurchaseOrderID), {
      PurchaseDate: Timestamp.fromDate(new Date(propRowData.PurchaseDate)),
      PurchaseOrderID: parseInt(propRowData.PurchaseOrderID),
      SupplierID: parseInt(propRowData.SupplierID),
      TotalCost: parseInt(propRowData.TotalCost),
    });
    alert("Successfully inserted!");
    window.location.reload();
  } catch (error) {
    console.error("Error inserting document:", error);
    alert("Failed to insert record.");
  }
};

export const insertDocument = async (e, inputData) => {
  e.preventDefault();

  if (inputData.IssuedBy === inputData.ReceivedBy) {
    alert("IssuedBy and ReceivedBy cannot be the same user.");
    return;
  }

  try {
    console.log("Uploading file to Firebase Storage");
    const fileRef = ref(storage, "DCS/" + inputData.Link.name);
    await uploadBytes(fileRef, inputData.Link);
    const fileUrl = await getDownloadURL(fileRef);
    console.log("File uploaded successfully:", fileUrl);
    await setDoc(doc(db, "item_document", inputData.DocumentID), {
      DateIssued: Timestamp.fromDate(new Date(inputData.DateIssued)),
      DocumentID: inputData.DocumentID,
      DocumentType: inputData.DocumentType,
      IssuedBy: inputData.IssuedBy,
      Link: fileUrl,
      ReceivedBy: inputData.ReceivedBy,
    });
    alert("Successfully inserted!");
    window.location.reload();
  } catch (error) {
    console.error("Error inserting document:", error);
    alert("Failed to insert record.");
  }
};
