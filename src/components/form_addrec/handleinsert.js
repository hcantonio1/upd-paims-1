import { db, storage } from "../../../firebase-config";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "@firebase/storage";

export const handleSubmit = async (e, docData, propertyRows) => {
  e.preventDefault();

  console.log("I received document:", docData);
  console.log(`I received properties[${propertyRows.length}]:`, propertyRows);

  // const { DocumentID, DocumentType, DateIssued, IssuedBy, ReceivedBy, Link, ...propRowData } = inputData;
  // console.log(propRowData);

  // await insertPropRow(e, propRowData, inputData.DocumentID);
  // await insertDocument(e, inputData);
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

export const insertDocument = async (e, documentData) => {
  e.preventDefault();
  try {
    console.log("Uploading file to Firebase Storage");

    const fileRef = ref(storage, "DCS/" + documentData.Link.name);
    await uploadBytes(fileRef, documentData.Link);
    const fileUrl = await getDownloadURL(fileRef);
    console.log("File uploaded successfully:", fileUrl);

    await setDoc(doc(db, "item_document", documentData.DocumentID), {
      DateIssued: Timestamp.fromDate(new Date(documentData.DateIssued)),
      DocumentID: documentData.DocumentID,
      DocumentType: documentData.DocumentType,
      IssuedBy: documentData.IssuedBy,
      Link: fileUrl,
      ReceivedBy: documentData.ReceivedBy,
    });
    alert("Successfully inserted!");
    window.location.reload();
  } catch (error) {
    console.error("Error inserting document:", error);
    alert("Failed to insert document.");
  }
};
