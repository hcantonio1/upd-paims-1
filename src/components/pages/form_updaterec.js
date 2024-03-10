// Step 1: Import React
import * as React from "react";
import { Link } from "gatsby";
import Layout from "../layout";
import { useState, useEffect } from "react";
import { db, storage } from "../../services/firebase-config";
import { doc, updateDoc, Timestamp, getDoc, collection, getDocs } from "firebase/firestore"; 
import { makeStyles } from "@material-ui/core";
import { Typography, Divider, Box, Button, Stack } from '@mui/material';

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




  // ARCHIVE RECORD FUNCTIONS
  const [archiveData, setArchiveData] = useState({
    PropertyID: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [textInput, setTextInput] = useState('');

  const handleTextChange = (event) => {
    setTextInput(event.target.value);
  };

  const fetchArchiveData = async (archiveId) => {
    try {
      const arcRef = doc(db, "property", archiveId);
      const arcSnap = await getDoc(arcRef);

      if (arcSnap.exists()) {
        const arcData = arcSnap.data();
        if (arcData.isArchived === 0) {
          setButtonDisabled(false);
        } else {
          setButtonDisabled(true);
        };
        setArchiveData(prevData => ({
          ...prevData,
          IsArchived: arcData.IsArchived,
        }));
      }
      if (!arcSnap.exists()) {
        setButtonDisabled(false);
        setArchiveData(prevData => ({
          ...prevData,
          IsArchived: "",
        }));
      }
    } catch (error) {
      console.error("Error fetching archived:", error);
    }
  }

  const handleArchive = async (e) => {
    e.preventDefault();

    try {
      const archiveRef = doc(db, "property", archiveData.PropertyID);
      await updateDoc(archiveRef, {
        IsArchived: 1,
      });
      alert("Successfully archived!");
      window.location.reload();
    } catch (error) {
      console.error("Error archiving:", error);
      alert("Failed to archive.");
    }
  };

  const handleArchiveChange = (e) => {
    setArchiveData({
      ...archiveData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === 'PropertyID') {
      fetchArchiveData(e.target.value);
    }
  };








  const useStyles = makeStyles({
    root: {
      padding: 20,
      margin: 5
    },
   
    updateRecordTextContainer: {
      backgroundColor: '#e5e5e5',
      padding: 10,
    },
   
    updateRecordFields: {
      borderStyle: 'solid',
      borderColor: '#e5e5e5',
      padding: 10,
      mr: 150
    },
  
  })

  const classes = useStyles()

  return (
    <Layout pageTitle="UPDATE / ARCHIVE">
      <Box
        display='flex'
        flexDirection='column'
        className={classes.root}
      >
        <main>
          <Box sx={{ mb: 3 }}>
            <Button href="/app/submitform/" variant="outlined" size="small" color="success"> 
              Back to Forms
            </Button>
          </Box>
          
          <Box
            display='flex'
            flexDirection='column'
          >
            <Box className={classes.updateRecordTextContainer}>
              <Typography
                variant='h9'
                fontWeight={"bold"}
              >
                Update an Existing Record in the Database
              </Typography>
            </Box>


            
            <form onSubmit={handleUpdateProperty}>
            <Box
              sx={{ pt: 3, pb: 2}}
              className={classes.updateRecordFields}
            >
              
              <Typography
                variant='h9'
                fontWeight={"bold"}
              >
                Update Item Details
              </Typography>
              <Divider></Divider>

              {/* FIELDS: PropertyID, PropertySupervisor */}
              <Stack 
              padding={1}
              spacing={10}
              mt={2}
              direction="row" 
              justifyContent="flex-start"
              >
                <Stack item>
                  <label htmlFor="PropertyID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Property ID<span style={{ color: 'red' }}>*</span>   </label>
                  <input type="text" name="PropertyID" value={updateProperty.PropertyID} onChange={handleUpdatePropChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." required/>
                </Stack>
                <Stack item>
                  <label htmlFor="PropertySupervisorID" style={{ display: 'inline-block', width: '250px', verticalAlign: 'top' }}>Property Supervisor ID   </label>
                  <select name="PropertySupervisorID" value={updateProperty.PropertySupervisorID} onChange={handleUpdatePropChange} style={{ width: '300px', display: 'inline-block' }} required >
                    <option value="">Select Property Supervisor</option>
                    {users.map((user, index) => (
                      <option key={`propertysupervisor_${index}`} value={user.UserID}>{getFullName(user)}</option>
                    ))}
                  </select>
                </Stack>
              </Stack>



              {/* FIELDS: Status, Location */}
              <Stack 
              padding={1}
              spacing={10}
              mb={1}
              direction="row" 
              justifyContent="flex-start"
              >
                <Stack item>
                  <label htmlFor="Status" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Status   </label>
                  <select name="StatusID" value={updateProperty.StatusID} onChange={handleUpdatePropChange} style={{ width: '300px', display: 'inline-block' }} >
                  <option value ="">Select Status</option>
                    {statuses.map((status, index) => (
                      <option key={`status${index}`} value={status.StatusID}>{status.StatusName}</option>
                    ))}
                  </select>
                </Stack>
                <Stack item>
                  <label htmlFor="LocationID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Location   </label>
                  <select name="LocationID" value={updateProperty.LocationID} onChange={handleUpdatePropChange} style={{ width: '300px', display: 'inline-block' }} required >
                    <option value ="">Select Location</option>
                    {locations.map((location, index) => (
                      <option key={`location_${index}`} value={location.LocationID}>{getFullLoc(location)}</option>
                    ))}
                  </select>
                </Stack>
              </Stack>

              <Stack 
                padding={1}
                direction="row" 
                alignItems="flex-start" 
                justifyContent="flex-end"
              >
                <Stack item>
                  <Button type="submit" variant="contained" size="small" color="success" >Submit</Button>
                </Stack>
              </Stack>

            </Box>
            </form>
          </Box>


          
          <br />
          <br />
          <Box
            display='flex'
            flexDirection='column'
          >
            <Box className={classes.updateRecordTextContainer}>
              <Typography
                variant='h9'
                fontWeight={"bold"}
              >
                Update a Supplier in the Database
              </Typography>
            </Box>

            
            <form onSubmit={handleUpdateSupplier}>
            <Box
              sx={{ pt: 3, pb: 3}}
              className={classes.updateRecordFields}
            >
              
              <Typography
                variant='h9'
                fontWeight={"bold"}
              >
                Update Supplier Details
              </Typography>
              <Divider></Divider>


              {/* FIELDS: SupplierID, SupplierName */}
              <Stack 
              padding={1}
              spacing={2}
              mt={2}
              direction="row" 
              justifyContent="space-between"
              >
                <Stack item>
                  <label htmlFor="SupplierID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Supplier ID<span style={{ color: 'red' }}>*</span>   </label>
                  <input type="text" name="SupplierID" value={updateSupplier.SupplierID} onChange={handleUpdateSupChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." required/>
                </Stack>
                <Stack item>
                  <label htmlFor="SupplierName" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Supplier Name   </label>
                  <input type="text" name="SupplierName" value={updateSupplier.SupplierName} onChange={handleUpdateSupChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." required/>
                </Stack>
                <Stack item>
                  <label htmlFor="SupplierContact" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Supplier Contact   </label>
                  <input type="text" name="SupplierContact" value={updateSupplier.SupplierContact} onChange={handleUpdateSupChange} style={{ width: '250px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only."/>
                </Stack>
              </Stack>



              {/* FIELDS: Unit, Street, City, State */}
              <Stack 
              padding={1}
              spacing={2}
              mb={1}
              direction="row" 
              justifyContent="space-between"
              >
                <Stack item>
                  <label htmlFor="UnitNumber" style={{ display: 'inline-block', width: '120px', verticalAlign: 'top' }}>Unit Number   </label>
                  <input type="text" name="UnitNumber" value={updateSupplier.UnitNumber} onChange={handleUpdateSupChange} style={{ width: '110px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only."/>
                </Stack>
                <Stack item>
                  <label htmlFor="StreetName" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Street Name   </label>
                  <input type="text" name="StreetName" value={updateSupplier.StreetName} onChange={handleUpdateSupChange} style={{ width: '300px', display: 'inline-block' }} />
                </Stack>
                <Stack item>
                  <label htmlFor="City" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>City   </label>
                  <input type="text" name="City1" value={updateSupplier.City} onChange={handleUpdateSupChange} style={{ width: '290px', display: 'inline-block' }} />
                </Stack>
                <Stack item>
                  <label htmlFor="State" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>State   </label>
                  <input type="text" name="State1" value={updateSupplier.State} onChange={handleUpdateSupChange} style={{ width: '140px', display: 'inline-block' }} />
                </Stack>
              </Stack>

              <Stack 
                padding={1}
                direction="row" 
                alignItems="flex-start" 
                justifyContent="flex-end"
              >
                <Stack item>
                  <Button type="submit" variant="contained" size="small" color="success" >Submit</Button>
                </Stack>
              </Stack>

            </Box>
            </form>
          </Box>






          
          <br />
          <br />
          <Box
            display='flex'
            flexDirection='column'
          >
            <Box className={classes.updateRecordTextContainer}>
              <Typography
                variant='h9'
                fontWeight={"bold"}
              >
                Archive a Record in the Database
              </Typography>
            </Box>

            
            <form onSubmit={handleArchive}>
            <Box
              sx={{ pt: 3, pb: 3}}
              className={classes.updateRecordFields}
            >
              
              <Typography
                variant='h9'
                fontWeight={"bold"}
              >
                Record Details
              </Typography>
              <Divider></Divider>


              {/* FIELDS: PropertyID, ArchiveStatus */}
              <Stack 
              padding={1}
              spacing={10}
              mt={2}
              direction="row" 
              justifyContent="flex-start"
              >
                <Stack item>
                  <label htmlFor="PropertyID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Property ID<span style={{ color: 'red' }}>*</span>   </label>
                  <input type="text" name="PropertyID" value={archiveData.PropertyID} onChange={handleArchiveChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." required/>
                </Stack>
                <Stack item>
                  <label htmlFor="isArchived" style={{ display: 'inline-block', width: '250px', verticalAlign: 'top' }}>Current Archive Status<span style={{ color: 'red' }}></span>  </label>
                  <input type="text" name="isArchived" value={archiveData.IsArchived} onChange={handleArchiveChange} style={{ width: '300px', display: 'inline-block' }} readOnly={true}/>
                </Stack>
              </Stack>

              <Stack 
                padding={1}
                direction="row" 
                alignItems="flex-start" 
                justifyContent="flex-end"
              >
                <Stack item>
                  <Button type="submit" disabled={buttonDisabled} variant="contained" size="small" color="success" >Submit</Button>
                </Stack>
              </Stack>

            </Box>
            </form>
          </Box>


        </main>
      </Box>
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









{/* <main>
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
      </main> */}

