import { db, storage } from "../../../firebase-config";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "@firebase/storage";

export const handleInsertDoc = async (e, inputData) => {
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
