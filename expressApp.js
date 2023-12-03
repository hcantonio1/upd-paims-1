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


// CHANGES FOR INVENTORY STARTING HERE

app.get('/', (req, res) => {
  res.send('Hello, World!'); // Replace this with your desired response
});




app.get('/property', (req, res) => {
  connection.query('SELECT * FROM property', (error, results, fields) => {
    if (error) {
      console.error('Error executing property query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json({ data: results });
  });
});

app.get('/item_category', (req, res) => {
  connection.query('SELECT * FROM item_category', (error, results, fields) => {
    if (error) {
      console.error('Error executing item_category query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json({ data: results });
  });
});




// CHANGES DONE


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
  
        const insertproperty = `INSERT INTO property (PropertyID, PropertyName, StatusID, PropertySupervisorID, SupplierID, LocationID, CategoryID, DocumentID, ArchiveStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        connection.query(insertproperty, [userInput.PropertyID, userInput.PropertyName, userInput.StatusID, userInput.PropertySupervisorID, userInput.SupplierID, userInput.LocationID, userInput.CategoryID, userInput.DocumentID, 1], (propertyQueryErr, propertyResults) => {
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

app.post('/updateProperty', (req, res) => {
  const { userInput } = req.body;

  connection.beginTransaction((beginTransactionErr) => {
    if (beginTransactionErr) {
      console.error('Error beginning transaction:', beginTransactionErr);
      res.status(500).send('Error beginning transaction');
      return;
    }

    let updatedCheck = 0;
    const propertyexistquery = `SELECT * FROM property WHERE PropertyID = ?`;
    connection.query(propertyexistquery, [userInput.PropertyID1], (err, results) => {
      if (err) {
        console.error('Error querying the database:', err);
        res.status(500).send('Error querying the database');
        return;
      }
      //check first if propertyid is present in table
      if (results.length > 0) {
        if (userInput.StatusID1 != '') {
          updateStatus();
          updatedCheck = 1;
        } 
        if (userInput.LocationID1 != '') {
          updateLocation();
          updatedCheck = 1;
        }
        if (userInput.PropertySupervisorID1 != '') {
          updateSupervisor();
          updatedCheck = 1;
        }
        if (updatedCheck === 1) {
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
        }
      } else {
          console.log('Property does not exist!');
        };
      });
    });

  function updateStatus() {
    connection.beginTransaction((beginTransactionErr) => {
      if (beginTransactionErr) {
        console.error('Error beginning transaction:', beginTransactionErr);
        res.status(500).send('Error beginning transaction');
        return;
      }
  
      const statuspropquery = `UPDATE property SET StatusID = ? WHERE PropertyID = ?`;
      connection.query(statuspropquery, [userInput.StatusID1, userInput.PropertyID1], (statuspropQueryErr, statusPropResults) => {
        if (statuspropQueryErr) {
          console.error('Error updating status in property:', statuspropQueryErr);
          connection.rollback(() => {
            res.status(500).send('Error updating status in property:');
          });
          return;
        }
        console.log('Property status updated successfully!');
      });
    });
  }

  function updateLocation() {
    connection.beginTransaction((beginTransactionErr) => {
      if (beginTransactionErr) {
        console.error('Error beginning transaction:', beginTransactionErr);
        res.status(500).send('Error beginning transaction');
        return;
      }
  
      const proplocquery = `UPDATE property SET LocationID = ? WHERE PropertyID = ?`;
      connection.query(proplocquery, [userInput.LocationID1, userInput.PropertyID1], (proplocQueryErr, proplocResults) => {
        if (proplocQueryErr) {
          console.error('Error updating location in property:', proplocQueryErr);
          connection.rollback(() => {
            res.status(500).send('Error updating location in property:');
          });
          return;
        }
        console.log('Property location updated successfully!');
      });
    });
  }

  function updateSupervisor() {
    connection.beginTransaction((beginTransactionErr) => {
      if (beginTransactionErr) {
        console.error('Error beginning transaction:', beginTransactionErr);
        res.status(500).send('Error beginning transaction');
        return;
      }
  
      const propsupquery = `UPDATE property SET PropertySupervisorID = ? WHERE PropertyID = ?`;
      connection.query(propsupquery, [userInput.PropertySupervisorID1, userInput.PropertyID1], (propsupQueryErr, propsupResults) => {
        if (propsupQueryErr) {
          console.error('Error updating property supervisor in property:', propsupQueryErr);
          connection.rollback(() => {
            res.status(500).send('Error updating property supervisor in property:');
          });
          return;
        }
        console.log('Property supervisor updated successfully!');
      });
    });
  }
});

app.post('/updateSupplier', (req, res) => {
  const { userInput } = req.body;

  connection.beginTransaction((beginTransactionErr) => {
    if (beginTransactionErr) {
      console.error('Error beginning transaction:', beginTransactionErr);
      res.status(500).send('Error beginning transaction');
      return;
    }

    let updatedCheck = 0;
    const supplierexistquery = `SELECT * FROM supplier WHERE SupplierID = ?`;
    connection.query(supplierexistquery, [userInput.SupplierID1], (err, results) => {
      if (err) {
        console.error('Error querying the database:', err);
        res.status(500).send('Error querying the database');
        return;
      }
      //check first if propertyid is present in table
      if (results.length > 0) {
        if (userInput.SupplierContact1 != '') {
          updateContact();
          updatedCheck = 1;
        } 
        if (userInput.UnitNumber1 != '') {
          updateUnit();
          updatedCheck = 1;
        }
        if (userInput.StreetName1 != '') {
          updateStreet();
          updatedCheck = 1;
        }
        if (userInput.City1 != '') {
          updateCity();
          updatedCheck = 1;
        }
        if (userInput.State1 != '') {
          updateState();
          updatedCheck = 1;
        }
        if (updatedCheck === 1) {
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
        }
      } else {
          console.log('Supplier does not exist!');
        };
      });
    });

  function updateContact() {
    connection.beginTransaction((beginTransactionErr) => {
      if (beginTransactionErr) {
        console.error('Error beginning transaction:', beginTransactionErr);
        res.status(500).send('Error beginning transaction');
        return;
      }
  
      const supconquery = `UPDATE supplier SET SupplierContact = ? WHERE SupplierID = ?`;
      connection.query(supconquery, [userInput.SupplierContact1, userInput.SupplierID1], (supconQueryErr, supconResults) => {
        if (supconQueryErr) {
          console.error('Error updating contact in supplier:', supconQueryErr);
          connection.rollback(() => {
            res.status(500).send('Error updating status in supplier:');
          });
          return;
        }
        console.log('Supplier contact updated successfully!');
      });
    });
  }

  function updateUnit() {
    connection.beginTransaction((beginTransactionErr) => {
      if (beginTransactionErr) {
        console.error('Error beginning transaction:', beginTransactionErr);
        res.status(500).send('Error beginning transaction');
        return;
      }
  
      const unitquery = `UPDATE supplier SET UnitNumber = ? WHERE SupplierID = ?`;
      connection.query(unitquery, [userInput.UnitNumber1, userInput.SupplierID1], (unitQueryErr, unitResults) => {
        if (unitQueryErr) {
          console.error('Error updating unit number in supplier:', unitQueryErr);
          connection.rollback(() => {
            res.status(500).send('Error updating unit number in supplier:');
          });
          return;
        }
        console.log('Supplier unit number updated successfully!');
      });
    });
  } 

  function updateStreet() {
    connection.beginTransaction((beginTransactionErr) => {
      if (beginTransactionErr) {
        console.error('Error beginning transaction:', beginTransactionErr);
        res.status(500).send('Error beginning transaction');
        return;
      }
  
      const streetquery = `UPDATE supplier SET StreetName = ? WHERE SupplierID = ?`;
      connection.query(streetquery, [userInput.StreetName1, userInput.SupplierID1], (streetQueryErr, streetResults) => {
        if (streetQueryErr) {
          console.error('Error updating street in supplier:', streetQueryErr);
          connection.rollback(() => {
            res.status(500).send('Error updating street in supplier:');
          });
          return;
        }
        console.log('Supplier street updated successfully!');
      });
    });
  }

  function updateCity() {
    connection.beginTransaction((beginTransactionErr) => {
      if (beginTransactionErr) {
        console.error('Error beginning transaction:', beginTransactionErr);
        res.status(500).send('Error beginning transaction');
        return;
      }
  
      const cityquery = `UPDATE supplier SET City = ? WHERE SupplierID = ?`;
      connection.query(cityquery, [userInput.City1, userInput.SupplierID1], (cityQueryErr, cityResults) => {
        if (cityQueryErr) {
          console.error('Error updating city in supplier:', cityQueryErr);
          connection.rollback(() => {
            res.status(500).send('Error updating city in supplier:');
          });
          return;
        }
        console.log('Supplier city updated successfully!');
      });
    });
  }

  function updateState() {
    connection.beginTransaction((beginTransactionErr) => {
      if (beginTransactionErr) {
        console.error('Error beginning transaction:', beginTransactionErr);
        res.status(500).send('Error beginning transaction');
        return;
      }
  
      const statequery = `UPDATE supplier SET State = ? WHERE SupplierID = ?`;
      connection.query(statequery, [userInput.State1, userInput.SupplierID1], (stateQueryErr, stateResults) => {
        if (stateQueryErr) {
          console.error('Error updating state in supplier:', stateQueryErr);
          connection.rollback(() => {
            res.status(500).send('Error updating state in supplier:');
          });
          return;
        }
        console.log('Supplier state updated successfully!');
      });
    });
  }
});

process.on('SIGINT', () => {
  connection.end();
  console.log('Connection closed');
  process.exit();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});