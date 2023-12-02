const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // Import CORS

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors()); // Enable CORS

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'paims'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL!');
});

app.post('/addData', (req, res) => {
  const { userInput } = req.body; // Assuming userInput is the data sent from Gatsby

  connection.beginTransaction((beginTransactionErr) => {
    if (beginTransactionErr) {
      console.error('Error beginning transaction:', beginTransactionErr);
      res.status(500).send('Error beginning transaction');
      return;
    }

    const documentquery = `INSERT INTO item_document (DocumentNumber, DocumentType, DateIssued, IssuedBy, ReceivedBy, Link) VALUES (?, ?, ?, ?, ?, ?)`;
    connection.query(documentquery, [userInput.DocumentNumber, userInput.DocumentType, userInput.DateIssued, userInput.IssuedBy, userInput.ReceivedBy, userInput.Link], (documentQueryErr, documentResults) => {
      if (documentQueryErr) {
        console.error('Error inserting data into item_document:', documentQueryErr);
        connection.rollback(() => {
          res.status(500).send('Error inserting data into item_document');
        });
        return;
      }
      console.log('Data inserted into item_document successfully!');

      const insertproperty = `INSERT INTO property (PropertyID, PropertyName, StatusID, PropertySupervisorID, SupplierID, LocationID, ItemCategoryID, DocumentID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      connection.query(insertproperty, [userInput.PropertyID, userInput.PropertyName, userInput.StatusID, userInput.PropertySupervisorID, userInput.SupplierID, userInput.LocationID, userInput.ItemCategoryID, userInput.DocumentNumber], (propertyQueryErr, propertyResults) => {
        if (propertyQueryErr) {
          console.error('Error inserting data into property:', propertyQueryErr);
          connection.rollback(() => {
            res.status(500).send('Error inserting data into property');
          });
          return;
        }
        console.log('Data inserted into property successfully!');

        const purchasequery = `INSERT INTO purchase_order (PurchaseOrderID, PropertyID, SupplierID, PurchaseDate, TotalCost) VALUES (?, ?, ?, ?, ?)`;
        connection.query(purchasequery, [userInput.PurchaseOrderID, userInput.PropertyID, userInput.SupplierID, userInput.PurchaseDate, userInput.TotalCost], (purchaseQueryErr, purchaseResults) => {
          if (purchaseQueryErr) {
            console.error('Error inserting data into purchase_order:', purchaseQueryErr);
            connection.rollback(() => {
              res.status(500).send('Error inserting data into purchase_order');
            });
            return;
          }
          console.log('Data inserted into purchase_order successfully!');

          connection.commit((commitErr) => {
            if (commitErr) {
              console.error('Error committing transaction:', commitErr);
              connection.rollback(() => {
                res.status(500).send('Error committing transaction');
              });
              return;
            }
            console.log('Transaction committed successfully!');
            res.status(200).send('Data inserted successfully');
          });
        });
      });
    });
  });
});

app.post('/insertData', (req, res) => {
  const { CategoryID, CategoryName, Category_Desc, LocationID, Building, RoomNumber } = req.body;

  connection.beginTransaction((beginTransactionErr) => {
    if (beginTransactionErr) {
      console.error('Error beginning transaction:', beginTransactionErr);
      res.status(500).send('Error beginning transaction');
      return;
    }

    const categoryquery = `INSERT INTO item_category (CategoryID, CategoryName, Category_Desc) VALUES (?, ?, ?)`;
    connection.query(categoryquery, [CategoryID, CategoryName, Category_Desc], (categoryQueryErr, categoryResults) => {
      if (categoryQueryErr) {
        console.error('Error inserting data into item_category:', categoryQueryErr);
        connection.rollback(() => {
          res.status(500).send('Error inserting data into item_category');
        });
        return;
      }
      console.log('Data inserted into item_category successfully!');

      const locationquery = `INSERT INTO item_location (LocationID, Building, RoomNumber) VALUES (?, ?, ?)`;
      connection.query(locationquery, [LocationID, Building, RoomNumber], (locationQueryErr, locationResults) => {
        if (locationQueryErr) {
          console.error('Error inserting data into item_location:', locationQueryErr);
          connection.rollback(() => {
            res.status(500).send('Error inserting data into item_location');
          });
          return;
        }
        console.log('Data inserted into item_location successfully!');

        connection.commit((commitErr) => {
          if (commitErr) {
            console.error('Error committing transaction:', commitErr);
            connection.rollback(() => {
              res.status(500).send('Error committing transaction');
            });
            return;
          }
          console.log('Transaction committed successfully!');
          res.status(200).send('Data inserted successfully');
        });
      });
    });
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});