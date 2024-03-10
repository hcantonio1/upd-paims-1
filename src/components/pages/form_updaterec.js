// Step 1: Import React
import * as React from "react";
import { Link } from "gatsby";
import Layout from "../layout";
import { useState, useEffect } from "react";
import { db, storage } from "../../services/firebase-config";
import { doc, updateDoc, Timestamp, getDoc, collection, getDocs } from "firebase/firestore"; 

const UpdateRec = () => {
  const [updateProperty, setUpdateProperty] = useState({
    StatusID: "",
    PropertySupervisorID: "",
    LocationID: "",
    PropertyID: "",
  });

  const [updateSupplier, setUpdateSupplier] = useState({
    SupplierContact: '',
    UnitNumber: '',
    StreetName: '',
    City: '',
    State: '',
    SupplierID: '',
    SupplierName: '',
  });

  const [users, setUsers] = useState([]);
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
    fetchLocations();
    fetchStatuses();
  }, []);

  const getFullName = (user) => {
    return `${user.FirstName} ${user.LastName}`;
  };  

  const getFullLoc = (location) => {
    return `${location.Building} ${location.RoomNumber}`;
  };  

  const fetchSupplierData = async (supplierId) => {
    try {
      const supRef = doc(db, "supplier", supplierId);
      const supSnap = await getDoc(supRef);

      if (supSnap.exists()) {
        const supData = supSnap.data();
        setUpdateSupplier(prevData => ({
          ...prevData,
          City: supData.City,
          State: supData.State,
          StreetName: supData.StreetName,
          SupplierContact: supData.SupplierContact,
          SupplierName: supData.SupplierName,
          UnitNumber: supData.UnitNumber,
        }));
      }
      if (!supSnap.exists()) {
        setUpdateSupplier(prevData => ({
          ...prevData,
          City: "",
          State: "",
          StreetName: "",
          SupplierContact: "",
          SupplierName: "",
          UnitNumber: "",
        }));
      }
    } catch (error) {
      console.error("Error fetching supplier:", error);
    }
  };

  const fetchPropertyData = async (propId) => {
    try {
      const propRef = doc(db, "property", propId);
      const propSnap = await getDoc(propRef);

      if (propSnap.exists()) {
        const propData = propSnap.data();
        setUpdateProperty(prevData => ({
          ...prevData,
          LocationID: propData.LocationID,
          StatusID: propData.StatusID,
          PropertySupervisorID: propData.PropertySupervisorID,
        }));
      }
      if (!propSnap.exists()) {
        setUpdateProperty(prevData => ({
          ...prevData,
          LocationID: "",
          StatusID: "",
          PropertySupervisorID: "",
        }));
      }
    } catch (error) {
      console.error("Error fetching property:", error);
    }
  };

  const handleUpdateSupplier = async (e) => {
    e.preventDefault();

    try {
      const supplierRef = doc(db, "supplier", updateSupplier.SupplierID);
      await updateDoc(supplierRef, {
        City: updateSupplier.City,
        State: updateSupplier.State,
        StreetName: updateSupplier.StreetName,
        SupplierContact: updateSupplier.SupplierContact.toString(),
        SupplierName: updateSupplier.SupplierName,
        UnitNumber: updateSupplier.UnitNumber,
      });
      alert("Successfully updated supplier!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating supplier:", error);
      alert("Failed to update supplier.");
    }
  };

  const handleUpdateProperty = async (e) => {
    e.preventDefault();

    try {
      const propertyRef = doc(db, "property", updateProperty.PropertyID);
      await updateDoc(propertyRef, {
        PropertyID: updateProperty.PropertyID,
        LocationID: updateProperty.LocationID,
        StatusID: updateProperty.StatusID,
        PropertySupervisorID: updateProperty.PropertySupervisorID,
      });
      alert("Successfully updated property!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating property:", error);
      alert("Failed to update property.");
    }
  };
  
  const handleUpdatePropChange = async (e) => {
    setUpdateProperty({
      ...updateProperty,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === 'PropertyID') {
      fetchPropertyData(e.target.value);
    }
  };

  const handleUpdateSupChange = async (e) => {
    setUpdateSupplier({
      ...updateSupplier,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === 'SupplierID') {
      fetchSupplierData(e.target.value);
    }
  };

  return (
    <Layout pageTitle="UPDATE A RECORD">
      <main>
        <Link to="/app/submitform/">Return to Submit Form Page</Link>
        <form onSubmit={handleUpdateProperty}>
          <div>
            <p>Update Property Details</p>
            <label htmlFor="PropertyID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Property ID<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="PropertyID" value={updateProperty.PropertyID} onChange={handleUpdatePropChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." required/>
            <br />
            <label htmlFor="Status" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Status:   </label>
            <select name="StatusID" value={updateProperty.StatusID} onChange={handleUpdatePropChange} style={{ width: '310px', display: 'inline-block' }} >
            <option value ="">Select Status</option>
              {statuses.map((status, index) => (
                <option key={`status${index}`} value={status.StatusID}>{status.StatusName}</option>
              ))}
            </select>
            <br />
            <label htmlFor="PropertySupervisorID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Property Supervisor ID:   </label>
            <select name="PropertySupervisorID" value={updateProperty.PropertySupervisorID} onChange={handleUpdatePropChange} style={{ width: '300px', display: 'inline-block' }} required >
              <option value="">Select Property Supervisor</option>
              {users.map((user, index) => (
                <option key={`propertysupervisor_${index}`} value={user.UserID}>{getFullName(user)}</option>
              ))}
            </select>
            <br />
            <label htmlFor="LocationID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Location:   </label>
            <select name="LocationID" value={updateProperty.LocationID} onChange={handleUpdatePropChange} style={{ width: '310px', display: 'inline-block' }} required >
              <option value ="">Select Location</option>
              {locations.map((location, index) => (
                <option key={`location_${index}`} value={location.LocationID}>{getFullLoc(location)}</option>
              ))}
            </select>
            <br />
          </div>
          <button type="submit">Submit</button>
        </form>
        <form onSubmit={handleUpdateSupplier}>
          <div>
            <p>Update Supplier</p>
            <label htmlFor="SupplierID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Supplier ID<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="SupplierID" value={updateSupplier.SupplierID} onChange={handleUpdateSupChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." required/>
            <br />
            <label htmlFor="SupplierName" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Supplier Name:   </label>
            <input type="text" name="SupplierName" value={updateSupplier.SupplierName} onChange={handleUpdateSupChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." required/>
            <br />
            <label htmlFor="SupplierContact" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Supplier Contact:   </label>
            <input type="text" name="SupplierContact" value={updateSupplier.SupplierContact} onChange={handleUpdateSupChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only."/>
            <br />
            <label htmlFor="UnitNumber" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Unit Number:   </label>
            <input type="text" name="UnitNumber" value={updateSupplier.UnitNumber} onChange={handleUpdateSupChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only."/>
            <br />
            <label htmlFor="StreetName" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Street Name:   </label>
            <input type="text" name="StreetName" value={updateSupplier.StreetName} onChange={handleUpdateSupChange} style={{ width: '300px', display: 'inline-block' }} />
            <br />
            <label htmlFor="City" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>City:   </label>
            <input type="text" name="City1" value={updateSupplier.City} onChange={handleUpdateSupChange} style={{ width: '300px', display: 'inline-block' }} />
            <br />
            <label htmlFor="State" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>State:   </label>
            <input type="text" name="State1" value={updateSupplier.State} onChange={handleUpdateSupChange} style={{ width: '300px', display: 'inline-block' }} />
          </div>
          <button type="submit">Submit</button>
        </form>
      </main>
    </Layout>
  );
};

// You'll learn about this in the next task, just copy it for now
export const Head = () => <title>Update Database</title>;

// Step 3: Export your component
export default UpdateRec;

//personal notes
//current problems with adding record:
//lengthy process if doing it one by one per property
//current problems with updating record:
//
