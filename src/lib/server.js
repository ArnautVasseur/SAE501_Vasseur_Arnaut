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

app.use(express.static(path.join(__dirname, '')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
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

app.get('/panier', (req, res) => {
    db.all('SELECT * FROM Panier', (err, rows) => {
        if (err) {
            console.error('Error fetching recipes:', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(rows); // Return the list of recipes as JSON response
    });
});

var identifiant = ""
var test = ""

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