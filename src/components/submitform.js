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

  const handleInsert = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/addData", {
        userInput: inputData,
      });

      console.log(response.data); // Success message
    } catch (error) {
      console.error("Error cannot access:", error);
    }
  };

  const handleUpdateProp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/updateProperty",
        {
          userInput: updateProperty,
        }
      );

      console.log(response.data); // Success message
    } catch (error) {
      console.error("Error cannot access:", error);
    }
  };

  const handleUpdateSup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/updateSupplier",
        {
          userInput: updateSupplier,
        }
      );

      console.log(response.data); // Success message
    } catch (error) {
      console.error("Error cannot access:", error);
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
            <input type="text" name="SupplierID" value={inputData.SupplierID} onChange={handleInputChange} placeholder="Supplier ID"/>
            <input type="text" name="SupplierName" value={inputData.SupplierName} onChange={handleInputChange} placeholder="Supplier Name"/>
            <input type="text" name="SupplierContact" value={inputData.SupplierContact} onChange={handleInputChange} placeholder="Contact Number"/>
            <input type="text" name="UnitNumber" value={inputData.UnitNumber} onChange={handleInputChange} placeholder="Unit Number"/>
            <input type="text" name="StreetName" value={inputData.StreetName} onChange={handleInputChange} placeholder="Street Name"/>
            <input type="text" name="City" value={inputData.City} onChange={handleInputChange} placeholder="City"/>
            <input type="text" name="State" value={inputData.State} onChange={handleInputChange} placeholder="State"/>
          </div>
          <div>
            <p>Insert Record Details</p>
            <input type="text" name="DocumentID" value={inputData.DocumentID} onChange={handleInputChange} placeholder="Document ID"/>
            <input type="text" name="DocumentType" value={inputData.DocumentType} onChange={handleInputChange} placeholder="Document Type"/>
            <input type="text" name="DateIssued" value={inputData.DateIssued} onChange={handleInputChange} placeholder="Date Issued"/>
            <input type="text" name="IssuedBy" value={inputData.IssuedBy} onChange={handleInputChange} placeholder="Issued By"/>
            <input type="text" name="ReceivedBy" value={inputData.ReceivedBy} onChange={handleInputChange} placeholder="Received By"/>
            <input type="text" name="Link" value={inputData.Link} onChange={handleInputChange} placeholder="Link"/>
            <input type="text" name="PropertyID" value={inputData.PropertyID} onChange={handleInputChange} placeholder="Property ID"/>
            <input type="text" name="PropertyName" value={inputData.PropertyName} onChange={handleInputChange} placeholder="Property Name"/>
            <input type="text" name="StatusID" value={inputData.StatusID} onChange={handleInputChange} placeholder="Status"/>
            <input type="text" name="PropertySupervisorID" value={inputData.PropertySupervisorID} onChange={handleInputChange} placeholder="Property Supervisor ID"/>
            <input type="text" name="LocationID" value={inputData.LocationID} onChange={handleInputChange} placeholder="Location ID"/>
            <input type="text" name="CategoryID" value={inputData.CategoryID} onChange={handleInputChange} placeholder="Category ID"/>
            <input type="text" name="PurchaseOrderID" value={inputData.PurchaseOrderID} onChange={handleInputChange} placeholder="Purchase Order ID"/>
            <input type="text" name="PurchaseDate" value={inputData.PurchaseDate} onChange={handleInputChange} placeholder="Purchase Date"/>
            <input type="text" name="TotalCost" value={inputData.TotalCost} onChange={handleInputChange} placeholder="Total Cost"/>
          </div>
          <button type="submit">Submit</button>
        </form>
        <h2>Update a record in property or supplier</h2>
        <p>Fields that may be updated are: StatusID, LocationID, PropertySupervisorID, SupplierContact, UnitNumber, StreetName, City, State</p>
        <p>Others pretty much untouched since they are dates, prices, etc.</p>
        <form onSubmit={handleUpdateProp}>
          <div>
            <p>Update Property</p>
            <input type="text" name="PropertyID1" value={updateProperty.PropertyID1} onChange={handleUpdatePropChange} placeholder="Property ID"/>
            <input type="text" name="StatusID1" value={updateProperty.StatusID1} onChange={handleUpdatePropChange} placeholder="Status"/>
            <input type="text" name="PropertySupervisorID1" value={updateProperty.PropertySupervisorID1} onChange={handleUpdatePropChange} placeholder="Property Supervisor ID"/>
            <input type="text" name="LocationID1" value={updateProperty.LocationID1} onChange={handleUpdatePropChange} placeholder="Location ID"/>
          </div>
          <button type="submit">Submit</button>
        </form>
        <form onSubmit={handleUpdateSup}>
          <div>
            <p>Update Supplier</p>
            <input type="text" name="SupplierID1" value={updateSupplier.SupplierID1} onChange={handleUpdateSupChange} placeholder="Supplier ID"/>
            <input type="text" name="SupplierContact1" value={updateSupplier.SupplierContact1} onChange={handleUpdateSupChange} placeholder="Contact Number"/>
            <input type="text" name="UnitNumber1" value={updateSupplier.UnitNumber1} onChange={handleUpdateSupChange} placeholder="Unit Number"/>
            <input type="text" name="StreetName1" value={updateSupplier.StreetName1} onChange={handleUpdateSupChange} placeholder="Street Name"/>
            <input type="text" name="City1" value={updateSupplier.City1} onChange={handleUpdateSupChange} placeholder="City"/>
            <input type="text" name="State1" value={updateSupplier.State1} onChange={handleUpdateSupChange} placeholder="State"/>
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
