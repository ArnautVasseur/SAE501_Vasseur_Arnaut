CREATE TABLE User(
    userID INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    password TEXT,
    panierID INTEGER,
    FOREIGN KEY (panierID) REFERENCES Panier(panierID)
);

CREATE TABLE Montre(
    montreID INTEGER PRIMARY KEY AUTOINCREMENT,
    boitierID,
    pierreID,
    braceletID,
    FOREIGN KEY(boitierID) REFERENCES Boitier(boitierID),
    FOREIGN KEY(pierreID) REFERENCES Pierre(pierreID),
    FOREIGN KEY(braceletID) REFERENCES bracelet(braceletID)
);

CREATE TABLE Boitier(
    boitierID INTEGER PRIMARY KEY,
    nom TEXT,
    texture TEXT,
    prix TEXT
);

CREATE TABLE Pierre(
    pierreID INTEGER PRIMARY KEY,
    nom TEXT,
    prix TEXT
);

CREATE TABLE Bracelet(
    braceletID INTEGER PRIMARY KEY,
    nom TEXT,
    texture TEXT,
    prix TEXT
);

CREATE TABLE Panier(
    panierID INTEGER PRIMARY KEY AUTOINCREMENT,
    userID INTEGER,
    montreID INTEGER,
    FOREIGN KEY(userID) REFERENCES User(userID),
    FOREIGN KEY(montreID) REFERENCES Montre(montreID)
);