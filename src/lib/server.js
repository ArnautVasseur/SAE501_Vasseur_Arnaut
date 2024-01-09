const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

const bcrypt = require('bcrypt');

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
      '',
     (err, rows) => {
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

app.post('/inscription', (req, res) => {
  const { NomUser, MotDePasse } = req.body;

  const hashMotDePasse = bcrypt.hashSync(MotDePasse, 10);

  const query = 'INSERT INTO Utilisateurs (NomUser, MotDePasse) VALUES (?, ?)';
  db.run(query, [NomUser, hashMotDePasse], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ UserID: this.lastID });
  });
});

app.post('/connexion', (req, res) => {
  const { NomUser, MotDePasse } = req.body;

  const query = 'SELECT * FROM Utilisateurs WHERE NomUser = ?';
  db.get(query, [NomUser], (err, Utilisateur) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!Utilisateur || !bcrypt.compareSync(MotDePasse, Utilisateur.MotDePasse)) {
      return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }

    // Créer un token JWT
    const token = jwt.sign({ UserID: Utilisateur.UserID }, 'votre_clé_secrète', { expiresIn: '1h' });

    res.json({ token, UserID: Utilisateur.UserID });
  });
});

// Middleware pour vérifier le token sur les requêtes protégées
function verifierToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Accès non autorisé' });
  }

  jwt.verify(token, 'votre_clé_secrète', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token non valide' });
    }

    req.UserID = decoded.UserID;
    next();
  });
}

// Exemple de route protégée
app.get('/exempleroute', verifierToken, (req, res) => {
  res.json({ message: 'Route protégée accessible' });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});