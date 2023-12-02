// Step 1: Import React
import * as React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/layout'
import { useState } from 'react';
import axios from 'axios';

const SubmitPage = () => {
    const [inputData, setInputData] = useState({
        ItemCategoryID: '',
        DocumentNumber: '',
        DocumentType: '',
        DateIssued: '',
        IssuedBy: '',
        ReceivedBy: '',
        Link: '',
        LocationID: '',
        Building: '',
        RoomNumber: '',
        PropertyID: '',
        PropertyName: '',
        StatusID: '',
        PropertySupervisorID: '',
        SupplierID: '',
        PurchaseOrderID: '',
        PurchaseDate: '',
        TotalCost: '',
      });

      const handleInsert = async (e) => {
        e.preventDefault();
    
        try {
          const response = await axios.post('http://localhost:3000/addData', {
            userInput: inputData
          });
    
          console.log(response.data); // Success message
        } catch (error) {
          console.error('Error cannot access:', error);
        }
      };

      const handleInputChange = (e) => {
        setInputData({
          ...inputData,
          [e.target.name]: e.target.value
        });
      };

    const handleUpdateClick = async () => {
        try {
          const response = await fetch('http://localhost:3000/insertData', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(
              { 
                CategoryID: 12, 
                CategoryName: 'switch', 
                Category_Desc: 'switch',
                LocationID: 7, 
                Building: 'Test',
                RoomNumber: 1
              })
          });
    
          if (response.ok) {
            console.log('Data updated successfully!');
          } else {
            console.error('Error updating data1:', response.statusText);
          }
        } catch (error) {
          console.error('Error updating data:', error);
        }
      };

  return (
    <main>
      <Layout pageTitle='Submit Form Page'>
        <h1>Submit Form Page</h1>
      </Layout>
      <button onClick={handleUpdateClick}>Update item_category and item_location</button>
      <p>Assume that the item_category, item_location, status, user and supplier tables will not be modified, meaning the inputs here for the meantime already exist in the aforementioned tables.</p>
      <form onSubmit={handleInsert}>
        <input type="text" name="ItemCategoryID" value={inputData.ItemCategoryID} onChange={handleInputChange} placeholder="ItemCategoryID"/>
        <input type="text" name="DocumentNumber" value={inputData.DocumentNumber} onChange={handleInputChange} placeholder="DocumentNumber"/>
        <input type="text" name="DocumentType" value={inputData.DocumentType} onChange={handleInputChange} placeholder="DocumentType"/>
        <input type="text" name="DateIssued" value={inputData.DateIssued} onChange={handleInputChange} placeholder="DateIssued"/>
        <input type="text" name="IssuedBy" value={inputData.IssuedBy} onChange={handleInputChange} placeholder="IssuedBy"/>
        <input type="text" name="ReceivedBy" value={inputData.ReceivedBy} onChange={handleInputChange} placeholder="ReceivedBy"/>
        <input type="text" name="Link" value={inputData.Link} onChange={handleInputChange} placeholder="Link"/>
        <input type="text" name="LocationID" value={inputData.LocationID} onChange={handleInputChange} placeholder="LocationID"/>
        <input type="text" name="PropertyID" value={inputData.PropertyID} onChange={handleInputChange} placeholder="PropertyID"/>
        <input type="text" name="PropertyName" value={inputData.PropertyName} onChange={handleInputChange} placeholder="PropertyName"/>
        <input type="text" name="StatusID" value={inputData.StatusID} onChange={handleInputChange} placeholder="StatusID"/>
        <input type="text" name="PropertySupervisorID" value={inputData.PropertySupervisorID} onChange={handleInputChange} placeholder="PropertySupervisorID"/>
        <input type="text" name="SupplierID" value={inputData.SupplierID} onChange={handleInputChange} placeholder="SupplierID"/>
        <input type="text" name="PurchaseOrderID" value={inputData.PurchaseOrderID} onChange={handleInputChange} placeholder="PurchaseOrderID"/>
        <input type="text" name="PurchaseDate" value={inputData.PurchaseDate} onChange={handleInputChange} placeholder="PurchaseDate"/>
        <input type="text" name="TotalCost" value={inputData.TotalCost} onChange={handleInputChange} placeholder="TotalCost"/>
        <button type="submit">Submit</button>
      </form>
    </main>
  )
}

// You'll learn about this in the next task, just copy it for now
export const Head = () => <title>Submit Form</title>

// Step 3: Export your component
export default SubmitPage