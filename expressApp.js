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
  const { userInput } = req.body;

  connection.beginTransaction((beginTransactionErr) => {
    if (beginTransactionErr) {
      console.error('Error beginning transaction:', beginTransactionErr);
      res.status(500).send('Error beginning transaction');
      return;
    }
    
    const checksupplierquery = `SELECT * FROM supplier WHERE SupplierID = ?`;
    connection.query(checksupplierquery, [userInput.SupplierID], (err, results) => {
      if (err) {
        console.error('Error querying the database:', err);
        res.status(500).send('Error querying the database');
        return;
      }

      if (results.length > 0) {
        insertRecord();
      } else {
        const supplierquery = `INSERT INTO supplier (SupplierID, SupplierName, SupplierContact, UnitNumber, StreetName, City, State) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        connection.query(supplierquery, [userInput.SupplierID, userInput.SupplierName, userInput.SupplierContact, userInput.UnitNumber, userInput.StreetName, userInput.City, userInput.State], (supplierQueryErr, supplierResults) => {
          if (supplierQueryErr) {
            console.error('Error inserting data into supplier:', supplierQueryErr);
            connection.rollback(() => {
              res.status(500).send('Error inserting data into supplier');
            });
            return;
          }

          console.log('Data inserted into supplier successfully!');

          insertRecord();

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
      }
    });
  });

  //function
  function insertRecord() {
    connection.beginTransaction((beginTransactionErr) => {
      if (beginTransactionErr) {
        console.error('Error beginning transaction:', beginTransactionErr);
        res.status(500).send('Error beginning transaction');
        return;
      }
  
      const documentquery = `INSERT INTO item_document (DocumentID, DocumentType, DateIssued, IssuedBy, ReceivedBy, Link) VALUES (?, ?, ?, ?, ?, ?)`;
      connection.query(documentquery, [userInput.DocumentID, userInput.DocumentType, userInput.DateIssued, userInput.IssuedBy, userInput.ReceivedBy, userInput.Link], (documentQueryErr, documentResults) => {
        if (documentQueryErr) {
          console.error('Error inserting data into item_document:', documentQueryErr);
          connection.rollback(() => {
            res.status(500).send('Error inserting data into item_document');
          });
          return;
        }
        console.log('Data inserted into item_document successfully!');
  
        const insertproperty = `INSERT INTO property (PropertyID, PropertyName, StatusID, PropertySupervisorID, SupplierID, LocationID, CategoryID, DocumentID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        connection.query(insertproperty, [userInput.PropertyID, userInput.PropertyName, userInput.StatusID, userInput.PropertySupervisorID, userInput.SupplierID, userInput.LocationID, userInput.CategoryID, userInput.DocumentID], (propertyQueryErr, propertyResults) => {
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
  }

});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});