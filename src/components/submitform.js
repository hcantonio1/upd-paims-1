// Step 1: Import React
import * as React from "react";
import { Link } from "gatsby";
import Layout from "./layout";
import { useState } from "react";
import axios from "axios";

const SubmitPage = () => {
  const [inputData, setInputData] = useState({
    SupplierID: "",
    SupplierName: "",
    SupplierContact: "",
    UnitNumber: "",
    StreetName: "",
    City: "",
    State: "",
    DocumentID: "",
    DocumentType: "",
    DateIssued: "",
    IssuedBy: "",
    ReceivedBy: "",
    Link: "",
    PropertyID: "",
    PropertyName: "",
    StatusID: "",
    PropertySupervisorID: "",
    LocationID: "",
    CategoryID: "",
    PurchaseOrderID: "",
    PurchaseDate: "",
    TotalCost: "",
  });

  const [updateProperty, setUpdateProperty] = useState({
    StatusID1: "",
    PropertySupervisorID1: "",
    LocationID1: "",
    PropertyID1: "",
  });

  const [updateSupplier, setUpdateSupplier] = useState({
    SupplierContact1: '',
    UnitNumber1: '',
    StreetName1: '',
    City1: '',
    State1: '',
    SupplierID1: '',
  });

  const [archiveData, setArchiveData] = useState({
    PropertyID2: "",
  });

  const handleInsert = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/addData", {
        userInput: inputData,
      });

      console.log(response.data); // Success message

      if (response.status === 200) {
        alert("Successfully inserted!");
        window.location.reload();
      }

    } catch (error) {
      console.error("Error cannot access:", error);
      alert("Supplier or record already exists, or transaction failed.");
    }
  };

  const handleUpdateProp = async (e) => {
    e.preventDefault();

    if (
      !updateProperty.StatusID1 &&
      !updateProperty.PropertySupervisorID1 &&
      !updateProperty.LocationID1
    ) {
      alert('Please enter at least one of Status ID, Property Supervisor ID, or Location ID');
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/updateProperty",
        {
          userInput: updateProperty,
        }
      );

      console.log(response.data); // Success message

      if (response.status === 200) {
        alert("Successfully updated property!");
        window.location.reload();
      }

    } catch (error) {
      console.error("Error cannot access:", error);
      alert("Failed to update property.");
    }
  };

  const handleUpdateSup = async (e) => {
    e.preventDefault();

    if (
      !updateSupplier.SupplierContact1 &&
      !updateSupplier.UnitNumber1 &&
      !updateSupplier.StreetName1 &&
      !updateSupplier.City1 &&
      !updateSupplier.State1
    ) {
      alert('Please enter at least one of Supplier Contact, Unit Number, Street Name, City or State.');
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/updateSupplier",
        {
          userInput: updateSupplier,
        }
      );

      console.log(response.data); // Success message

      if (response.status === 200) {
        alert("Successfully updated supplier!");
        window.location.reload();
      }

    } catch (error) {
      console.error("Error cannot access:", error);
      alert("Failed to update supplier.");
    }
  };

  const handleArchive = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/archiveData", {
        userInput: archiveData,
      });

      console.log(response.data); // Success message

      if (response.status === 200) {
        alert("Successfully archived!");
        window.location.reload();
      }

    } catch (error) {
      console.error("Error cannot access:", error);
      alert("Already archived.");
    }
  };

  const handleInputChange = (e) => {
    setInputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdatePropChange = (e) => {
    setUpdateProperty({
      ...updateProperty,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateSupChange = (e) => {
    setUpdateSupplier({
      ...updateSupplier,
      [e.target.name]: e.target.value,
    });
  };

  const handleArchiveChange = (e) => {
    setArchiveData({
      ...archiveData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Layout pageTitle="SUBMIT FORM">
      <main>
        <h2>Create a record in purchase_order, property, and item_document</h2>
        <p>Insert into supplier if it does not exist</p>
        <p>
          item_category untouched and item_location untouched since under the
          assumption the tables have complete data already and no need to update
          with new locations or categories.
        </p>
        <form onSubmit={handleInsert}>
          <div>
            <p>Supplier</p>
            <label htmlFor="SupplierID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Supplier ID<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="SupplierID" value={inputData.SupplierID} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." required/>
            <br />
            <label htmlFor="SupplierName" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Supplier Name:   </label>
            <input type="text" name="SupplierName" value={inputData.SupplierName} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} />
            <br />
            <label htmlFor="SupplierContact" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Supplier Contact:   </label>
            <input type="text" name="SupplierContact" value={inputData.SupplierContact} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." />
            <br />
            <label htmlFor="UnitNumber" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Unit Number:   </label>
            <input type="text" name="UnitNumber" value={inputData.UnitNumber} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." />
            <br />
            <label htmlFor="StreetName" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Street Name:   </label>
            <input type="text" name="StreetName" value={inputData.StreetName} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} />
            <br />
            <label htmlFor="City" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>City:   </label>
            <input type="text" name="City" value={inputData.City} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} />
            <br />
            <label htmlFor="State" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>State:   </label>
            <input type="text" name="State" value={inputData.State} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} />
          </div>
          <div>
            <p>Insert Record Details</p>
            <label htmlFor="DocumentID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Document ID<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="DocumentID" value={inputData.DocumentID} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} required/>
            <br />
            <label htmlFor="DocumentType" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Document Type<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="DocumentType" value={inputData.DocumentType} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} required/>
            <br />
            <label htmlFor="DateIssued" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Date Issued<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="DateIssued" value={inputData.DateIssued} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} pattern="\d{4}-\d{2}-\d{2}" title="yyyy-mm-dd" required/>
            <br />
            <label htmlFor="IssuedBy" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Issued By<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="IssuedBy" value={inputData.IssuedBy} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} required/>
            <br />
            <label htmlFor="ReceivedBy" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Received By<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="ReceivedBy" value={inputData.ReceivedBy} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} required/>
            <br />
            <label htmlFor="Link" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Link<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="Link" value={inputData.Link} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} required/>
            <br />
            <label htmlFor="PropertyID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Property ID<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="PropertyID" value={inputData.PropertyID} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." required/>
            <br />
            <label htmlFor="PropertyName" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Property Name<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="PropertyName" value={inputData.PropertyName} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} required/>
            <br />
            <label htmlFor="StatusID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Status ID<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="StatusID" value={inputData.StatusID} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." required/>
            <br />
            <label htmlFor="PropertySupervisorID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Property Supervisor ID<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="PropertySupervisorID" value={inputData.PropertySupervisorID} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." required/>
            <br />
            <label htmlFor="LocationID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Location ID<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="LocationID" value={inputData.LocationID} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." required/>
            <br />
            <label htmlFor="CategoryID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Category ID<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="CategoryID" value={inputData.CategoryID} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." required/>
            <br />
            <label htmlFor="PurchaseOrderID" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Purchase Order ID<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="PurchaseOrderID" value={inputData.PurchaseOrderID} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." required/>
            <br />
            <label htmlFor="PurchaseDate" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Purchase Date<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="PurchaseDate" value={inputData.PurchaseDate} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} pattern="\d{4}-\d{2}-\d{2}" title="yyyy-mm-dd" required/>
            <br />
            <label htmlFor="TotalCost" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Total Cost<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="TotalCost" value={inputData.TotalCost} onChange={handleInputChange} style={{ width: '300px', display: 'inline-block' }} pattern="^\d*\.?\d+$" title="Please enter a positive number." required/>
          </div>
          <button type="submit">Submit</button>
        </form>
        <h2>Update a record in property or supplier</h2>
        <p>Fields that may be updated are: StatusID, LocationID, PropertySupervisorID, SupplierContact, UnitNumber, StreetName, City, State</p>
        <p>Others pretty much untouched since they are dates, prices, etc.</p>
        <form onSubmit={handleUpdateProp}>
          <div>
            <p>Update Property</p>
            <label htmlFor="PropertyID1" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Property ID<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="PropertyID1" value={updateProperty.PropertyID1} onChange={handleUpdatePropChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." required/>
            <br />
            <label htmlFor="StatusID1" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Status ID:   </label>
            <input type="text" name="StatusID1" value={updateProperty.StatusID1} onChange={handleUpdatePropChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." />
            <br />
            <label htmlFor="PropertySupervisorID1" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Property Supervisor ID:   </label>
            <input type="text" name="PropertySupervisorID1" value={updateProperty.PropertySupervisorID1} onChange={handleUpdatePropChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only."/>
            <br />
            <label htmlFor="LocationID1" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Location ID:   </label>
            <input type="text" name="LocationID1" value={updateProperty.LocationID1} onChange={handleUpdatePropChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only."/>
            <br />
          </div>
          <button type="submit">Submit</button>
        </form>
        <form onSubmit={handleUpdateSup}>
          <div>
            <p>Update Supplier</p>
            <label htmlFor="SupplierID1" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Supplier ID<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="SupplierID1" value={updateSupplier.SupplierID1} onChange={handleUpdateSupChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." required/>
            <br />
            <label htmlFor="SupplierContact1" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Supplier Contact:   </label>
            <input type="text" name="SupplierContact1" value={updateSupplier.SupplierContact1} onChange={handleUpdateSupChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only."/>
            <br />
            <label htmlFor="UnitNumber1" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Unit Number:   </label>
            <input type="text" name="UnitNumber1" value={updateSupplier.UnitNumber1} onChange={handleUpdateSupChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only."/>
            <br />
            <label htmlFor="StreetName1" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Street Name:   </label>
            <input type="text" name="StreetName1" value={updateSupplier.StreetName1} onChange={handleUpdateSupChange} style={{ width: '300px', display: 'inline-block' }} />
            <br />
            <label htmlFor="City1" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>City:   </label>
            <input type="text" name="City1" value={updateSupplier.City1} onChange={handleUpdateSupChange} style={{ width: '300px', display: 'inline-block' }} />
            <br />
            <label htmlFor="State1" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>State:   </label>
            <input type="text" name="State1" value={updateSupplier.State1} onChange={handleUpdateSupChange} style={{ width: '300px', display: 'inline-block' }} />
          </div>
          <button type="submit">Submit</button>
        </form>
        <h2>Archive a record</h2>
        <p>Will only pretty much just change archive status in property table. If record is already archived, will say so in console.</p>
        <form onSubmit={handleArchive}>
          <div>
            <p>Archive a record</p>
            <label htmlFor="PropertyID2" style={{ display: 'inline-block', width: '150px', verticalAlign: 'top' }}>Property ID<span style={{ color: 'red' }}>*</span>:   </label>
            <input type="text" name="PropertyID2" value={archiveData.PropertyID2} onChange={handleArchiveChange} style={{ width: '300px', display: 'inline-block' }} pattern="[0-9]*" title="Numbers only." required/>
          </div>
          <button type="submit">Submit</button>
        </form>
      </main>
    </Layout>
  );
};

// You'll learn about this in the next task, just copy it for now
export const Head = () => <title>Submit Form</title>;

// Step 3: Export your component
export default SubmitPage;

//personal notes
//current problems with adding record:
//lengthy process if doing it one by one per property
//current problems with updating record:
//
