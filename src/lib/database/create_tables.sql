CREATE TABLE User(
    email TEXT PRIMARY KEY,
    password VARCHAR(255),
    panierID INT,
    FOREIGN KEY(panierID) REFERENCES Panier(panierID)
);