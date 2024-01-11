CREATE TABLE CopieMontre(
    copiemontreID INTEGER PRIMARY KEY AUTOINCREMENT,
    userID INTEGER,
    montreID INTEGER,
    boitier_forme TEXT,
    boitier_texture TEXT,
    boitier_prix DECIMAL(5,2),
    pierre_nom TEXT,
    pierre_prix INTEGER,
    bracelet_texture TEXT,
    bracelet_prix INTEGER,
    FOREIGN KEY (userID) REFERENCES User(userID),
    FOREIGN KEY (montreID) REFERENCES Montre(montreID)
);

CREATE TABLE Boitier(
    boitierID INTEGER PRIMARY KEY,
    nom TEXT,
    texture TEXT,
    prix DECIMAL(5,2)
);

CREATE TABLE Pierre(
    pierreID INTEGER PRIMARY KEY,
    nom TEXT,
    prix INTEGER
);

CREATE TABLE Bracelet(
    braceletID INTEGER PRIMARY KEY,
    nom TEXT,
    texture TEXT,
    prix INTEGER
);