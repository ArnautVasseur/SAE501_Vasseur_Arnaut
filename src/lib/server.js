const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new sqlite3.Database('./database/MontresDB.db', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the database');
  }
});

app.get('/', (req, res) => {
    res.redirect('/montres');
});

app.get('/montres', (req, res) => {
    db.all('SELECT * FROM Montre', (err, rows) => {
        if (err) {
            console.error('Error fetching recipes:', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(rows); // Return the list of recipes as JSON response
    });
});

app.get('/users', (req, res) => {
    db.all('SELECT * FROM User', (err, rows) => {
        if (err) {
            console.error('Error fetching recipes:', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(rows); // Return the list of recipes as JSON response
    });
});

app.get('/panier/:userID', (req, res) => {
    const { userID } = req.params;

    // Query to get the total count of distinct montreID values
    const getCountQuery = 'SELECT COUNT(DISTINCT montreID) as montreCount FROM Panier WHERE userID = ?';

    // Query to get the individual montreID values
    const getMontreIDQuery = 'SELECT DISTINCT montreID FROM Panier WHERE userID = ?';

    // Execute both queries in parallel using Promise.all
    Promise.all([
        new Promise((resolve, reject) => {
            db.get(getCountQuery, [userID], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ montreCount: row.montreCount });
                }
            });
        }),
        new Promise((resolve, reject) => {
            db.all(getMontreIDQuery, [userID], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ montreIDList: rows.map(row => row.montreID) });
                }
            });
        }),
    ])
        .then(results => {
            const [countResult, montreIDResult] = results;
            res.json({ ...countResult, ...montreIDResult });
        })
        .catch(err => {
            console.error('Error fetching cart data:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        });
});

app.post('/panier/:userID/add/montre', (req, res) => {
    const { userID } = req.params;
    const { montreID } = req.body;
  
    // Check if the cart exists
    db.get('SELECT * FROM Panier WHERE panierID = ?', [userID], (err, cart) => {
      if (err) {
        console.error('Error checking cart existence:', err.message);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      if (!cart) {
        res.status(404).json({ error: 'Cart not found' });
        return;
      }
  
      // Check if the watch exists in the Montre table
      db.get('SELECT * FROM Montre WHERE montreID = ?', [montreID], (err) => {
        if (err) {
          console.error('Error checking watch existence:', err.message);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        else{
          insertWatchIntoCart();
        }
      });
    });
  
    function insertWatchIntoCart() {
      // Insert the watch into the Panier table
      db.run('INSERT INTO Panier (panierID, montreID) VALUES (?, ?)', [userID, montreID], function (err) {
        if (err) {
          console.error('Error adding watch to the cart:', err.message);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
  
        // Fetch the updated cart for this specific user
        db.all('SELECT * from Panier WHERE panierID = ?', [userID], (err, cart) => {
          if (err) {
            console.error('Error fetching cart: ', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
          }
          res.json(cart); // Return the updated list of ingredients as a JSON response
        });
      });
    }
});

app.post('/panier/:userID/remove/montre', (req, res) => {
    const { userID } = req.params;
    const { montreID } = req.body;

    // Check if the cart exists
    db.get('SELECT * FROM Panier WHERE panierID = ?', [userID], (err, cart) => {
        if (err) {
            console.error('Error checking cart existence:', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        if (!cart) {
            res.status(404).json({ error: 'Cart not found' });
            return;
        }

        // Check if the watch exists in the Panier table for the specified user
        db.get('SELECT * FROM Panier WHERE panierID = ? AND montreID = ?', [userID, montreID], (err, watchInCart) => {
            if (err) {
                console.error('Error checking watch existence in the cart:', err.message);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            if (!watchInCart) {
                res.status(404).json({ error: 'Watch not found in the cart' });
                return;
            }

            removeWatchFromCart();
        });
    });

    function removeWatchFromCart() {
        // Remove the watch from the Panier table
        db.run('DELETE FROM Panier WHERE panierID = ? AND montreID = ?', [userID, montreID], function (err) {
            if (err) {
                console.error('Error removing watch from the cart:', err.message);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            // Fetch the updated cart for this specific user
            db.all('SELECT * FROM Panier WHERE panierID = ?', [userID], (err, updatedCart) => {
                if (err) {
                    console.error('Error fetching updated cart:', err.message);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }
                res.json(updatedCart); // Return the updated list of the cart as a JSON response
            });
        });
    }
});


app.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Step 1: Insert user into the User table
  const sqlInsertUser = `INSERT INTO User (email, password) VALUES (?, ?)`;
  db.run(sqlInsertUser, [email, password], function (err) {
    if (err) {
      console.error('Error creating account:', err.message);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    const userId = this.lastID;
    // Step 2: Generate a unique identifier for panierID (e.g., auto-incremented value)
    const panierID = userId;
    // Step 3: Update panierID with the generated value
    const sqlUpdatePanierID = `UPDATE User SET panierID = ? WHERE email = ?`;
    db.run(sqlUpdatePanierID, [panierID, email], function (err) {
      if (err) {
        console.error('Error updating panierID:', err.message);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      console.log(`Account created with email: ${email}, panierID: ${panierID}`);
      res.json({ message: 'Account created successfully' });
    });
  });
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check the User table for a matching email and password
    const sql = `SELECT * FROM User WHERE email = ? AND password = ?`;
    db.get(sql, [email, password], (err, row) => {
        if (err) {
            console.error('Error during login:', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (row) {
            console.log('Login successful');
            res.json({ message: 'Login successful' });
            identifiant = email
            test = password
            
        } else {
            console.log('Invalid email or password');
            res.status(401).json({ error: 'Invalid email or password' });
        }
    });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});