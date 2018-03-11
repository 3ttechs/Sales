DROP TABLE IF EXISTS sales_person_master;
DROP TABLE IF EXISTS product_master;
DROP TABLE IF EXISTS stock_master;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS invoice;

DROP TABLE IF EXISTS company_lookup;
DROP TABLE IF EXISTS product_category_lookup;
DROP TABLE IF EXISTS product_brand_lookup;
DROP TABLE IF EXISTS product_type_lookup;
DROP TABLE IF EXISTS product_coo_lookup;
DROP TABLE IF EXISTS admin_lookup;


--###################################################################################################################
--# Master Tables
--###################################################################################################################


CREATE TABLE sales_person_master (
    id       		INTEGER  	NOT NULL PRIMARY KEY AUTOINCREMENT,
    name     		TEXT 		NOT NULL,
    code     		TEXT 		NOT NULL UNIQUE,
    contact_number  TEXT 		NOT NULL,
    login     		TEXT 		NOT NULL UNIQUE,
    password 		TEXT 		NOT NULL
);


CREATE TABLE product_master (
    id       		INTEGER  	NOT NULL PRIMARY KEY AUTOINCREMENT,
    category 		TEXT 		NOT NULL,
    code 			TEXT 		NOT NULL UNIQUE,
    name     		TEXT 		NOT NULL,
    name_arabic     TEXT,
    brand     		TEXT 		NOT NULL,
    product_type    TEXT 		NOT NULL,
    coo     		TEXT  		NOT NULL,
    price    		REAL 		NOT NULL,
    image     		TEXT,
    status     		INTEGER 	NOT NULL
	
);

CREATE TABLE stock_master	(
    id       			INTEGER  	NOT NULL PRIMARY KEY AUTOINCREMENT,
	stock_entry_date 	DATE 	 	NOT NULL, 
	product_code  		TEXT 		NOT NULL,
	product_name 		TEXT,
	product_category 	TEXT,
	product_brand 		TEXT,
	product_type 		TEXT,
	product_coo 		TEXT,
	quantity 			REAL 		NOT NULL
);
	
--###################################################################################################################
--# Transaction Tables
--###################################################################################################################
CREATE TABLE invoice (
    id       			INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
	invoice_no			INTEGER  NOT NULL,
	invoice_date 		DATE 	 NOT NULL, 
	invoice_time 		TIME 	 NOT NULL,
	sales_person_code  	TEXT     NOT NULL,
	cutomer_name 		TEXT,
	cutomer_phone 		TEXT,
	cutomer_vat_no 		TEXT,
	sub_total 			REAL     NOT NULL,
	discount 			REAL,
	vat 				REAL,
	total 				REAL 	 NOT NULL,
	payment_mode 		INTEGER  NOT NULL
);

CREATE TABLE items (
    invoice_no       	INTEGER  	NOT NULL REFERENCES invoice (invoice_no),
    product_code 		TEXT,
    product_category 	TEXT,
    product_name     	TEXT 		NOT NULL,
    product_price    	REAL,
    product_coo    		TEXT,
    quantity         	REAL 		NOT NULL,
    discount         	REAL,
    amount           	REAL 		NOT NULL
);

--###################################################################################################################
--# Lookup Tables
--###################################################################################################################


CREATE TABLE company_lookup (	
	id 				INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	company_id 		TEXT 	NOT NULL UNIQUE,
	company_name 	TEXT 	NOT NULL,
	address_1 		TEXT,
	address_2  		TEXT,
	city  			TEXT,
	country  		TEXT,
	po_box  		TEXT,
	fax  			TEXT,
	website  		TEXT,
	trn_no   		TEXT,
	logo   			TEXT
);
	
CREATE TABLE product_category_lookup	 (
	id				INTEGER  	NOT NULL PRIMARY KEY AUTOINCREMENT,
	category_id 	TEXT 		NOT NULL UNIQUE,
	category_name 	TEXT 		NOT NULL
);	
CREATE TABLE product_brand_lookup	 (
	id 				INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
	brand_id 		TEXT NOT NULL UNIQUE,
	brand_name 		TEXT NOT NULL
);	
CREATE TABLE product_type_lookup	 (
	id 				INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
	type_id 		TEXT NOT NULL UNIQUE,
	type_name 		TEXT NOT NULL
);	
CREATE TABLE product_coo_lookup	 (
	id 				INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
	coo_id  		TEXT NOT NULL UNIQUE,
	coo_name 		TEXT NOT NULL
);
	



CREATE TABLE admin_lookup (
    id       INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    login     TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);
