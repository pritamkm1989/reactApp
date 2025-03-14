CREATE TABLE ApplianceCategories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    homePageEnabled BOOLEAN NOT NULL
);

CREATE TABLE Subcategories (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES ApplianceCategories(id)
);

CREATE TABLE ServiceTypes (
    id SERIAL PRIMARY KEY,
    subcategory_id INT NOT NULL,
    serviceType VARCHAR(255) NOT NULL,
    FOREIGN KEY (subcategory_id) REFERENCES Subcategories(id)
);

CREATE TABLE Brands (
    id SERIAL PRIMARY KEY,
    subcategory_id INT NOT NULL,
    brandName VARCHAR(255) NOT NULL,
    FOREIGN KEY (subcategory_id) REFERENCES Subcategories(id)
);

-- Insert data into ApplianceCategories table
INSERT INTO ApplianceCategories (name, homePageEnabled) 
VALUES 
('AC Repair & Service', TRUE),
('Microwave Repair & Service', TRUE),
('Refrigerator Repair & Service', TRUE),
('Washing Machine Repair & Service', FALSE);

-- Insert data into Subcategories table
INSERT INTO Subcategories (category_id, name, image) 
VALUES 
(1, 'Split AC', 'ac1'),
(1, 'Window AC', 'ac2'),
(2, 'Microwave Repair', 'mw'),
(3, 'Double Door Refrigerator', 'frige1'),
(3, 'Single Door Refrigerator', 'frige2'),
(4, 'Top Load Washing Machine', 'FL_WM'),
(4, 'Front Load Washing Machine', 'TL_WM');

-- Insert data into ServiceTypes table
INSERT INTO ServiceTypes (subcategory_id, serviceType)
VALUES 
(1, 'Repair'),
(1, 'Service'),
(1, 'Gas Change'),
(2, 'Repair'),
(2, 'Service'),
(2, 'Gas Change'),
(3, 'Repair'),
(3, 'Service'),
(4, 'Repair'),
(4, 'Service'),
(4, 'Gas Change'),
(5, 'Repair'),
(5, 'Service'),
(6, 'Repair'),
(6, 'Service'),
(6, 'Filter Change'),
(7, 'Repair'),
(7, 'Service'),
(7, 'Filter Change');

-- Insert data into Brands table
INSERT INTO Brands (subcategory_id, brandName)
VALUES 
(1, 'Samsung'),
(1, 'LG'),
(1, 'Daikin'),
(2, 'Whirlpool'),
(2, 'Carrier'),
(2, 'Hitachi'),
(3, 'Panasonic'),
(3, 'Samsung'),
(3, 'LG'),
(4, 'Samsung'),
(4, 'LG'),
(4, 'Whirlpool'),
(5, 'Godrej'),
(5, 'Haier'),
(5, 'Videocon'),
(6, 'Dyson'),
(6, 'Hoover'),
(6, 'Eureka'),
(7, 'Philips'),
(7, 'Black+Decker'),
(7, 'Rowenta');
