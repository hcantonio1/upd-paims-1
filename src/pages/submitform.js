// Step 1: Import React
import * as React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/layout'

const SubmitPage = () => {
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
    </main>
  )
}

// You'll learn about this in the next task, just copy it for now
export const Head = () => <title>Submit Form</title>

// Step 3: Export your component
export default SubmitPage