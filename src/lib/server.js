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

// Serve static files (including the HTML form)
app.use(express.static(path.join(__dirname, '')));

app.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/users', (req, res) => {
  db.all('SELECT * FROM User', (err, rows) => {
    if (err) {
      console.error('Error fetching recipes:', err.message);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(rows);
  });
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;

  const sql = `INSERT INTO User (email, password) VALUES (?, ?)`;
  db.run(sql, [email, password], function (err) {
    if (err) {
      console.error('Error creating account:', err.message);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    console.log(`Account created with ID: ${this.lastID}`);
    res.json({ message: 'Account created successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
