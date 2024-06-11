import { db, storage } from "../../../firebase-config";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "@firebase/storage";
import { getUser } from "../../services/auth.js";

export const handleSubmit = (e, docData, propertyRows, errors) => {
  e.preventDefault();

  console.log("I received document:", docData);
  console.log(`I received properties[${propertyRows.length}]:`, propertyRows);

  if (errors.count !== 0) {
    console.log("I have received errors", errors);
    return;
  }

  const propPromises = propertyRows.map((propRowData, index) => {
    const p = async () => {
      try {
        await insertPropRow(e, propRowData, docData.DocumentID);
      } catch (error) {
        console.log(`Error inserting Property ${index}.`);
        alert(`Property ${index} (and succeeding properties) were not inserted.`);
      }
    };
    return p();
  });

  Promise.all([insertDocument(e, docData), ...propPromises])
    .then(() => {
      alert("Successfully inserted all properties!");
      window.location.reload();
    })
    .catch((error) => {
      console.log("Some properties were not inserted.", error);
    });
};

const insertPropRow = async (e, propRowData, documentID) => {
  e.preventDefault();

  // try {
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
  docObject["a"] = documentID;
  await setDoc(doc(db, "property", propRowData.PropertyID), {
    CategoryID: parseInt(propRowData.CategoryID),
    Documents: docObject,
    isArchived: 0,
    isApproved: 0,
    LocationID: parseInt(propRowData.LocationID),
    PropertyID: parseInt(propRowData.PropertyID),
    PropertyName: propRowData.PropertyName,
    TrusteeID: parseInt(propRowData.TrusteeID),
    StatusID: parseInt(propRowData.StatusID),
    SupplierID: parseInt(propRowData.SupplierID),
    PurchaseOrderID: parseInt(propRowData.PurchaseOrderID),
    VerNum: "a",
  });
  await setDoc(doc(db, "purchase_order", propRowData.PurchaseOrderID), {
    PurchaseDate: Timestamp.fromDate(new Date(propRowData.PurchaseDate)),
    PurchaseOrderID: parseInt(propRowData.PurchaseOrderID),
    SupplierID: parseInt(propRowData.SupplierID),
    TotalCost: parseInt(propRowData.TotalCost),
  });
  // alert("Successfully inserted!");
  // window.location.reload();
  // } catch (error) {
  //   console.error("Error inserting document:", error);
  //   // alert("Failed to insert record.");
  // }
};

export const insertDocument = async (e, documentData) => {
  e.preventDefault();
  try {
    console.log("Uploading file to Firebase Storage");
    const fileRef = ref(storage, `${getUser().dept}` + "/" + documentData.holdLink.name);
    await uploadBytes(fileRef, documentData.holdLink);
    var fileUrl = await getDownloadURL(fileRef);
    console.log("File uploaded successfully:", fileUrl);

    if (documentData.holdLink.name === undefined) {
      fileUrl = documentData.Link;
    }

    await setDoc(doc(db, "item_document", documentData.DocumentID), {
      DateIssued: Timestamp.fromDate(new Date(documentData.DateIssued)),
      DocumentID: documentData.DocumentID,
      DocumentType: documentData.DocumentType,
      IssuedBy: documentData.IssuedBy,
      Link: fileUrl,
      ReceivedBy: documentData.ReceivedBy,
    });
    // alert("Successfully inserted!");
    // window.location.reload();
  } catch (error) {
    console.error("Error inserting document:", error);
    alert("Failed to insert document.");
  }
};
