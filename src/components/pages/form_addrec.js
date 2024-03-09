// Step 1: Import React
import * as React from "react";
import { Link } from "gatsby";
import Layout from "../layout";
import { useState, useEffect } from "react";
import { db, storage } from "../../services/firebase-config";
import { doc, setDoc, Timestamp, getDoc, collection, getDocs } from "firebase/firestore"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

const InsertRecord = () => {
  const [inputData, setInputData] = useState({
    DocumentID: "",
    DocumentType: "",
    DateIssued: "",
    IssuedBy: "",
    ReceivedBy: "",
    Link: "",
    CategoryID: "",
    LocationID: "",
    PropertyID: "",
    PropertyName: "",
    PropertySupervisorID: "",
    StatusID: "",
    SupplierID: "",
  });

  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userCollection = collection(db, 'user');
        const snapshot = await getDocs(userCollection);
        const users = snapshot.docs.map(doc => doc.data());
        setUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const categoryCollection = collection(db, 'item_category');
        const snapshot = await getDocs(categoryCollection);
        const categories = snapshot.docs.map(doc => doc.data());
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchLocations = async () => {
      try {
        const locationCollection = collection(db, 'item_location');
        const snapshot = await getDocs(locationCollection);
        const locations = snapshot.docs.map(doc => doc.data());
        setLocations(locations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    const fetchStatuses = async () => {
      try {
        const statusCollection = collection(db, 'status');
        const snapshot = await getDocs(statusCollection);
        const statuses = snapshot.docs.map(doc => doc.data());
        setStatuses(statuses);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };

    fetchUsers();
    fetchCategories();
    fetchLocations();
    fetchStatuses();
  }, []);

  const getFullName = (user) => {
    return `${user.FirstName} ${user.LastName}`;
  };  

  const getFullLoc = (location) => {
    return `${location.Building} ${location.RoomNumber}`;
  };  

  const handleInsert = async (e) => {
    e.preventDefault();

    if (inputData.IssuedBy === inputData.ReceivedBy) {
      alert("IssuedBy and ReceivedBy cannot be the same user.");
      return;
    }

    const issuedByUser = users.find(user => getFullName(user) === inputData.IssuedBy);
    const receivedByUser = users.find(user => getFullName(user) === inputData.ReceivedBy);

    try {
      const docRef = doc(db, "item_document", inputData.DocumentID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        alert("Document exists!");
      } else {
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
          await setDoc(doc(db, "property", inputData.PropertyID), {
            CategoryID: inputData.CategoryID,
            DocumentID: inputData.DocumentID,
            isArhived: 0,
            LocationID: inputData.LocationID,
            PropertyID: inputData.PropertyID,
            PropertyName: inputData.PropertyName,
            PropertySupervisorID: inputData.PropertySupervisorID,
            StatusID: inputData.StatusID,
            SupplierID: inputData.SupplierID,
          });
          alert("Successfully inserted!");
        } catch (error) {
          console.error("Error inserting document:", error);
          alert("Failed to insert record.");
        } 
      }
    } catch (error) {
     console.error("Error checking for document:", error);
      alert("Failed to check for document existence.");
    }
  }

  const handleInputChange = (e) => {
    setInputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setInputData({
      ...inputData,
      Link: file,
    });
  };
  

  return (
    <Layout pageTitle="CREATE A RECORD">
      <main>
        <Link to="/app/submitform/">Return to Submit Form Page</Link>
        <form onSubmit={handleInsert}>
          <div>
            <p>Insert Record Details</p>
            <label htmlFor="DocumentID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Document Name<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="DocumentID" value={inputData.DocumentID} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} required/>
            <br />
            <label htmlFor="DocumentType" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Document Type<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="DocumentType" value={inputData.DocumentType} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} required/>
            <br />
            <label htmlFor="DateIssued" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Date Issued<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="date" name="DateIssued" value={inputData.DateIssued} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} pattern="\d{4}-\d{2}-\d{2}" title="yyyy-mm-dd" required/>
            <br />
            <label htmlFor="IssuedBy" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Issued By<span style={{ color: 'red' }}>*</span>:   </label>
            <select name="IssuedBy" value={inputData.IssuedBy} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} required>
              <option value="">Select Issued By</option>
              {users.map((user, index) => (
                <option key={`issuedBy_${index}`} value={user.username}>{getFullName(user)}</option>
              ))}
            </select>
            <br />
            <label htmlFor="ReceivedBy" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Received By<span style={{ color: 'red' }}>*</span>:   </label>
            <select name="ReceivedBy" value={inputData.ReceivedBy} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} required>
              <option value="">Select Received By</option>
              {users.map((user, index) => (
                <option key={`receivedBy_${index}`} value={user.username}>{getFullName(user)}</option>
              ))}
            </select>
            <br />
            <label htmlFor="Link" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>File<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="file" name="Link" onChange={handleFileChange} style={{ width: '300px', display: 'inline-block' }} required/>
            <br />
            <label htmlFor="PropertyID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Property ID<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="PropertyID" value={inputData.PropertyID} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." required/>
            <br />
            <label htmlFor="PropertyName" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Property Name<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="PropertyName" value={inputData.PropertyName} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} required/>
            <br />
            <label htmlFor="StatusID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Status ID<span style={{ color: 'red' }}>*</span>:   </label>
            <select name="StatusID" value={inputData.StatusID} onChange={handleInputChange} style={{ width: '310px', display: 'inline-block' }}>
              <option value =""></option>
              <option value ="1">1: In use</option>
              <option value ="2">2: Available</option>
              <option value ="3">3: Broken</option>
            </select>
            <br />
            <label htmlFor="PropertySupervisorID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Property Supervisor ID<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="PropertySupervisorID" value={inputData.PropertySupervisorID} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." required/>
            <br />
            <label htmlFor="LocationID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Location ID<span style={{ color: 'red' }}>*</span>:   </label>
            <select name="LocationID" value={inputData.LocationID} onChange={handleInputChange} style={{ width: '310px', display: 'inline-block' }} required>
              <option value ="">Select Location</option>
              {locations.map((location, index) => (
                <option key={`location_${index}`} value={location.LocationID}>{getFullLoc(location)}</option>
              ))}
            </select>
            <br />
            <label htmlFor="CategoryID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Category ID<span style={{ color: 'red' }}>*</span>:   </label>
            <select name="CategoryID" value={inputData.CategoryID} onChange={handleInputChange} style={{ width: '310px', display: 'inline-block' }} required>
              <option value ="">Select Category</option>
              {categories.map((category, index) => (
                <option key={`category_${index}`} value={category.CategoryID}>{category.CategoryName}</option>
              ))}
            </select>
            <br />
          </div>
          <button type="submit">Submit</button>
        </form>
      </main>
    </Layout>
  );
};

// You'll learn about this in the next task, just copy it for now
export const Head = () => <title>Insert Record</title>;

// Step 3: Export your component
export default InsertRecord;