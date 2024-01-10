const express = require('express');
const sqlite3 = require('sqlite3');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
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
    db.all(
      `SELECT
        Montre.montreID,
        Boitier.nom AS boitier_nom,
        Boitier.prix AS boitier_prix,
        Boitier.texture AS boitier_texture,
        Pierre.nom AS pierre_nom,
        Pierre.prix AS pierre_prix,
        Bracelet.nom AS bracelet_nom,
        Bracelet.prix AS bracelet_prix,
        Bracelet.texture AS bracelet_texture
      FROM
        Montre
      JOIN Boitier ON Montre.boitierID = Boitier.boitierID
      JOIN Pierre ON Montre.pierreID = Pierre.pierreID
      JOIN Bracelet ON Montre.braceletID = Bracelet.braceletID;`,
     (err, rows) => {
        if (err) {
            console.error('Error fetching watches:', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(rows); // Return the list of recipes as JSON response
    });
});

app.get('/rawmontres', (req, res) => {
    db.all(
      `SELECT * from Montre;`,
     (err, rows) => {
        if (err) {
            console.error('Error fetching watches:', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(rows); // Return the list of recipes as JSON response
    });
});

app.get('/rawmontres/:montreID', (req, res) => {
    const {montreID} = req.params;
    db.all(
      `SELECT * from Montre WHERE montreID = ?;`,
      [montreID],
     (err, rows) => {
        if (err) {
            console.error('Error fetching watches:', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(rows); // Return the list of recipes as JSON response
    });
});

app.get('/montres/:montreID', (req, res) => {
    const {montreID} = req.params;

    db.all(
      `SELECT
        montreID,
        Boitier.nom AS boitier_nom,
        Boitier.prix AS boitier_prix,
        Boitier.texture AS boitier_texture,
        Pierre.nom AS pierre_nom,
        Pierre.prix AS pierre_prix,
        Bracelet.nom AS bracelet_nom,
        Bracelet.prix AS bracelet_prix,
        Bracelet.texture AS bracelet_texture
      FROM
        Montre
      JOIN Boitier ON Montre.boitierID = Boitier.boitierID
      JOIN Pierre ON Montre.pierreID = Pierre.pierreID
      JOIN Bracelet ON Montre.braceletID = Bracelet.braceletID
      WHERE montreID = ?;`, [montreID],
     (err, rows) => {
        if (err) {
            console.error('Error fetching watches:', err.message);
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

app.get('/boitier', (req, res) => {
    db.all('SELECT * FROM Boitier', (err, rows) => {
        if (err) {
            console.error('Error fetching recipes:', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(rows); // Return the list of recipes as JSON response
    });
});

app.get('/pierre', (req, res) => {
    db.all('SELECT * FROM Pierre', (err, rows) => {
        if (err) {
            console.error('Error fetching recipes:', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(rows); // Return the list of recipes as JSON response
    });
});

app.get('/bracelet', (req, res) => {
    db.all('SELECT * FROM Bracelet', (err, rows) => {
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

app.post('/inscription', (req, res) => {
  const { email, password } = req.body;

  // Validate the incoming data (you should add more validation)
  if (!email || !password) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  // Example: Insert user data into the database
  const insertUserQuery = 'INSERT INTO User (email, password) VALUES (?, ?)';
  db.run(insertUserQuery, [email, password], function (err) {
    if (err) {
      console.error('Error during user registration:', err.message);
      return res.status(500).json({ message: 'Internal server error' });
    }

    const userId = this.lastID;

    // Example: Update panierID for the user
    const updatePanierQuery = 'UPDATE User SET panierID = ? WHERE userID = ?';
    db.run(updatePanierQuery, [userId, userId], function (err) {
      if (err) {
        console.error('Error updating panierID for user:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
      }

      console.log(`User registered successfully with ID: ${userId}`);
      res.json({ message: 'User registered successfully' });
    });
  });
});

app.post('/connexion', (req, res) => {
  const secretKey = 'g23jh2g4kjn1k5v2&!hskjf5n1';
  const { email, password } = req.body;

  // Validate the incoming data (you should add more validation)
  if (!email || !password) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  // Check if the user exists and validate the password (you should use a secure password hashing mechanism)
  const selectUserQuery = 'SELECT * FROM User WHERE email = ? AND password = ?';
  db.get(selectUserQuery, [email, password], (err, user) => {
    if (err) {
      console.error('Error during user login:', err.message);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // User authenticated, generate a JWT token
    const token = jwt.sign({ userId: user.userID, email: user.email }, secretKey, { expiresIn: '1h' });

    res.json({ token });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});