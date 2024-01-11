const express = require('express');
const sqlite3 = require('sqlite3');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
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
    const getMontreIDQuery = `
      SELECT
        Montre.montreID,
        Boitier.nom AS boitier_nom,
        Boitier.prix AS boitier_prix,
        Boitier.texture AS boitier_texture,
        Pierre.nom AS pierre_nom,
        Pierre.prix AS pierre_prix,
        Bracelet.texture AS bracelet_texture,
        Bracelet.prix AS bracelet_prix
      FROM
        Panier
      JOIN
        User ON Panier.userID = User.userID
      JOIN
        Montre ON Panier.montreID = Montre.montreID
      JOIN
        Boitier ON Montre.boitierID = Boitier.boitierID
      JOIN
        Pierre ON Montre.pierreID = Pierre.pierreID
      JOIN
        Bracelet ON Montre.braceletID = Bracelet.braceletID
      WHERE
        Panier.userID = ?;
      `;

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
                    resolve({ montreData: rows });
                }
            });
        }),
    ])
        .then(results => {
            const [countResult, montreResult] = results;
            res.json({ ...countResult, ...montreResult });
        })
        .catch(err => {
            console.error('Error fetching cart data:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        });
});

app.post('/panier/ajout', (req, res) => {
  const { UserID, MontreID } = req.body

  const insertQuery = `
    INSERT INTO Panier (userID, montreID)
    VALUES (?, ?);
  `;

  db.run(insertQuery, [UserID, MontreID], (err) => {
    if (err) {
      console.error('Erreur lors de l\'ajout de la montre au panier:', err.message);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    } else {
      res.json({ message: 'Montre ajoutée au panier avec succès' });
    }
  });
});

app.post('/montre/ajout', (req, res) => {
  const {
    MontreID,
    BoitierID,
    PierreID,
    BraceletID,
  } = req.body;

  const insertQuery = `
    INSERT INTO Montre (MontreID, BoitierID, PierreID, BraceletID)
    VALUES (?, ?, ?, ?)
  `;

  db.run(insertQuery, [MontreID, BoitierID, PierreID, BraceletID], (err) => {
    if (err) {
      console.error('Erreur lors de l\'ajout de la montre:', err.message);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    } else {
      res.json({ message: 'Montre ajoutée avec succès' });
    }
  });
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
  const { email, password } = req.body;

  // Validate the incoming data (you should add more validation)
  if (!email || !password) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  // Check if the user exists and validate the password
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
    // const token = jwt.sign({ userId: user.userID, email: user.email }, 'token', { expiresIn: '1h' });

    res.json({ userId : user.userID });
  });
});

// Middleware pour vérifier le token sur les requêtes protégées
function verifierToken(req, res, next) {
  const token = req.header('Authorization');
  console.log(token);

  if (!token) {
    return res.status(401).json({ error: 'Accès non autorisé' });
  }

  jwt.verify(token, 'token', (err, decoded) => {
    if (err) {
      console.error('Erreur lors de la vérification du token:', err);
      return res.status(401).json({ error: 'Token non valide' });
    }

    const { userID } = decoded;

    if (!userID) {
      return res.status(401).json({ error: 'Token ne contient pas l\'UserID' });
    }

    console.log('Token valide pour l\'UserID:', userID);

    req.userID = decoded.userID;
    next();
  });
}

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});