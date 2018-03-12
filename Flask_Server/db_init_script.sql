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
    id	       			INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    invoice_no       	INTEGER  	NOT NULL REFERENCES invoice (id),
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

--###################################################################################################################
--# Initial Data
--###################################################################################################################

INSERT INTO admin_lookup ( login, password) VALUES ( 'Admin', 'admin');
INSERT INTO admin_lookup ( login, password) VALUES ( 'Owner', 'owner'); 


INSERT INTO sales_person_master (name,code,contact_number,login,password ) VALUES ( 'Abdul A','Abdul11',11111111,'Abdul', 'abdul');
INSERT INTO sales_person_master (name,code,contact_number,login,password ) VALUES ( 'Yasin Y','Yasin22',22222222,'Yasin', 'yasin'); 
INSERT INTO sales_person_master (name,code,contact_number,login,password ) VALUES ( 'Hamsa H','Hamsa33',33333333,'Hamsa', 'hamsa'); 
INSERT INTO sales_person_master (name,code,contact_number,login,password ) VALUES ( 'Omar O','Omar44',44444444,'Omar', 'omar');
INSERT INTO sales_person_master (name,code,contact_number,login,password ) VALUES ( 'Ahmed A','Ahmed55',55555555,'Ahmed', 'ahmed'); 
INSERT INTO sales_person_master (name,code,contact_number,login,password ) VALUES ( 'Ali A','Ali66',6666666,'Ali', 'ali'); 

INSERT INTO product_master (category, code, name, name_arabic, brand, product_type, coo, price, image, status) VALUES ( 'Floral','1', 'Daisy','Daisy','Marc Jacobs','Perfume1','India', 2.54,'a.png',1);
INSERT INTO product_master (category, code, name, name_arabic, brand, product_type, coo, price, image, status) VALUES ( 'Floral','2', 'Romance','Romance','Ralph Lauren','Perfume2','India',16.76,'b.png',1);
INSERT INTO product_master (category, code, name, name_arabic, brand, product_type, coo, price, image, status) VALUES ( 'Oriental','3', 'Addict','Addict','Dior','Perfume3','India',24.5,'c.png',1);
INSERT INTO product_master (category, code, name, name_arabic, brand, product_type, coo, price, image, status) VALUES ( 'Oriental','4', 'Flower','Flower','Kanzo','Perfume4','India',196,'d.png',1);
INSERT INTO product_master (category, code, name, name_arabic, brand, product_type, coo, price, image, status) VALUES ( 'Chypre','5', 'Rush 2 Perfume','Rush 2 Perfume','Gucci','Perfume5','India',12.36,'e.png',1); 
INSERT INTO product_master (category, code, name, name_arabic, brand, product_type, coo, price, image, status) VALUES ( 'Green','6', 'Be Delicious','Be Delicious','DKNY','Perfume6','Japan',122,'f.png',0); 
INSERT INTO product_master (category, code, name, name_arabic, brand, product_type, coo, price, image, status) VALUES ( 'Fougere','7', 'Havana Pour Elle','Havana Pour Elle','Aramis','Perfume7','Japan',76.23,'g.png',0);
INSERT INTO product_master (category, code, name, name_arabic, brand, product_type, coo, price, image, status) VALUES ( 'Oceanic','8', 'Sunflowers','Sunflowers','Elizabeth Arden','Perfume8','Japan',45.5,'h.png',1); 
INSERT INTO product_master (category, code, name, name_arabic, brand, product_type, coo, price, image, status) VALUES ( 'Oceanic','9', 'Cool Water Woman','Cool Water Woman','Davidoff','Perfume9','Japan',23.03,'i.png',0); 
INSERT INTO product_master (category, code, name, name_arabic, brand, product_type, coo, price, image, status) VALUES ( 'Wood','10', 'Black','Black','Bvlgari','Perfume10','China',123.01,'j.png',1); 
	
INSERT INTO invoice (invoice_date, invoice_time,  sales_person_code,cutomer_name,cutomer_phone,cutomer_vat_no,sub_total,discount,vat,total,payment_mode) VALUES ( '2016-03-09','02:54:12', 'Abdul','AA',9448373533,'11',36.54,0.01,0.01,11.02,1); 
INSERT INTO invoice (invoice_date, invoice_time,  sales_person_code,cutomer_name,cutomer_phone,cutomer_vat_no,sub_total,discount,vat,total,payment_mode) VALUES ( '2016-02-19','02:14:12', 'Yasin','BB',1234567890,'22',116.54,0.01,0.01,15.02,2); 
INSERT INTO invoice (invoice_date, invoice_time,  sales_person_code,cutomer_name,cutomer_phone,cutomer_vat_no,sub_total,discount,vat,total,payment_mode) VALUES ( '2016-02-19','02:24:12', 'Hamsa','CC',9449835331,'33',16.54,0.01,0.01,22.02,1); 
INSERT INTO invoice (invoice_date, invoice_time,  sales_person_code,cutomer_name,cutomer_phone,cutomer_vat_no,sub_total,discount,vat,total,payment_mode) VALUES ( '2016-03-09','05:54:26', 'Omar','DD',11223344556,'44',16.54,0.01,0.01,22.02,2); 
INSERT INTO invoice (invoice_date, invoice_time,  sales_person_code,cutomer_name,cutomer_phone,cutomer_vat_no,sub_total,discount,vat,total,payment_mode) VALUES ( '2016-03-08','05:54:26', 'Ahmed','EE',11223344556,'55',16.54,0.00,0.01,22.02,1); 
INSERT INTO invoice (invoice_date, invoice_time,  sales_person_code,cutomer_name,cutomer_phone,cutomer_vat_no,sub_total,discount,vat,total,payment_mode) VALUES ( '2016-03-19','05:54:26', 'Ali','FF',11223344556,'66',16.54,0.00,0.01,22.02,1); 



INSERT INTO items (invoice_no,product_code,product_category,product_name,product_price,product_coo,quantity,discount,amount) VALUES (1,'1','Floral', 'Daisy',2.54,'India',12,0.02,2.54); 
INSERT INTO items (invoice_no,product_code,product_category,product_name,product_price,product_coo,quantity,discount,amount) VALUES (1,'1','Floral', 'Daisy',2.541,'India',12,0.02,2.54); 
INSERT INTO items (invoice_no,product_code,product_category,product_name,product_price,product_coo,quantity,discount,amount) VALUES (1,'1','Floral', 'Daisy',2.542,'India',12,0.02,2.54); 
INSERT INTO items (invoice_no,product_code,product_category,product_name,product_price,product_coo,quantity,discount,amount) VALUES (2,'1','Floral', 'Daisy',2.54,'India',12,0.02,2.54); 
INSERT INTO items (invoice_no,product_code,product_category,product_name,product_price,product_coo,quantity,discount,amount) VALUES (2,'1','Floral', 'Daisy',2.541,'India',12,0.02,2.54); 
INSERT INTO items (invoice_no,product_code,product_category,product_name,product_price,product_coo,quantity,discount,amount) VALUES (2,'1','Floral', 'Daisy',2.542,'India',12,0.02,2.54); 
INSERT INTO items (invoice_no,product_code,product_category,product_name,product_price,product_coo,quantity,discount,amount) VALUES (3,'1','Floral', 'Daisy',2.54,'India',12,0.02,2.54); 
INSERT INTO items (invoice_no,product_code,product_category,product_name,product_price,product_coo,quantity,discount,amount) VALUES (3,'1','Floral', 'Daisy',2.541,'India',12,0.02,2.54); 
INSERT INTO items (invoice_no,product_code,product_category,product_name,product_price,product_coo,quantity,discount,amount) VALUES (3,'1','Floral', 'Daisy',2.542,'India',12,0.02,2.54); 
INSERT INTO items (invoice_no,product_code,product_category,product_name,product_price,product_coo,quantity,discount,amount) VALUES (4,'1','Floral', 'Daisy',2.54,'India',12,0.02,2.54); 
INSERT INTO items (invoice_no,product_code,product_category,product_name,product_price,product_coo,quantity,discount,amount) VALUES (4,'1','Floral', 'Daisy',2.541,'India',12,0.02,2.54); 
INSERT INTO items (invoice_no,product_code,product_category,product_name,product_price,product_coo,quantity,discount,amount) VALUES (4,'1','Floral', 'Daisy',2.542,'India',12,0.02,2.54); 
INSERT INTO items (invoice_no,product_code,product_category,product_name,product_price,product_coo,quantity,discount,amount) VALUES (5,'1','Floral', 'Daisy',2.54,'India',12,0.02,2.54); 
INSERT INTO items (invoice_no,product_code,product_category,product_name,product_price,product_coo,quantity,discount,amount) VALUES (5,'1','Floral', 'Daisy',2.541,'India',12,0.02,2.54); 
INSERT INTO items (invoice_no,product_code,product_category,product_name,product_price,product_coo,quantity,discount,amount) VALUES (5,'1','Floral', 'Daisy',2.542,'India',12,0.02,2.54); 
INSERT INTO items (invoice_no,product_code,product_category,product_name,product_price,product_coo,quantity,discount,amount) VALUES (6,'1','Floral', 'Daisy',2.54,'India',12,0.02,2.54); 
INSERT INTO items (invoice_no,product_code,product_category,product_name,product_price,product_coo,quantity,discount,amount) VALUES (6,'1','Floral', 'Daisy',2.541,'India',12,0.02,2.54); 
INSERT INTO items (invoice_no,product_code,product_category,product_name,product_price,product_coo,quantity,discount,amount) VALUES (6,'1','Floral', 'Daisy',2.542,'India',12,0.02,2.54); 


INSERT INTO stock_master (stock_entry_date,product_code,product_name,product_category,product_brand,product_type,product_coo,quantity ) VALUES ( '2016-03-09','1','Daisy','Floral','Dior','Perfume1','India',1234);
INSERT INTO stock_master (stock_entry_date,product_code,product_name,product_category,product_brand,product_type,product_coo,quantity ) VALUES ( '2016-03-10','1','Daisy','Floral','Dior','Perfume1','India',1234);
INSERT INTO stock_master (stock_entry_date,product_code,product_name,product_category,product_brand,product_type,product_coo,quantity ) VALUES ( '2016-03-11','1','Daisy','Floral','Dior','Perfume1','India',1234);
INSERT INTO stock_master (stock_entry_date,product_code,product_name,product_category,product_brand,product_type,product_coo,quantity ) VALUES ( '2016-03-12','1','Daisy','Floral','Dior','Perfume1','India',1234);
INSERT INTO stock_master (stock_entry_date,product_code,product_name,product_category,product_brand,product_type,product_coo,quantity ) VALUES ( '2016-03-13','1','Daisy','Floral','Dior','Perfume1','India',1234);
INSERT INTO stock_master (stock_entry_date,product_code,product_name,product_category,product_brand,product_type,product_coo,quantity ) VALUES ( '2016-03-14','1','Daisy','Floral','Dior','Perfume1','India',1234);
INSERT INTO stock_master (stock_entry_date,product_code,product_name,product_category,product_brand,product_type,product_coo,quantity ) VALUES ( '2016-03-15','1','Daisy','Floral','Dior','Perfume1','India',1234);


INSERT INTO company_lookup (company_id,company_name,address_1,address_2,city,country,po_box,fax,website,trn_no,logo) VALUES ('AB1234','ABB Limited', 'Road 1', 'Road 2','Bangalore','India','1234','2233','www.abc.com','9999','logo1');  
INSERT INTO company_lookup (company_id,company_name,address_1,address_2,city,country,po_box,fax,website,trn_no,logo) VALUES ('AB1235','ABC Limited', 'Road 1', 'Road 2','Bangalore','India','1234','2233','www.abc.com','9999','logo1');  
INSERT INTO company_lookup (company_id,company_name,address_1,address_2,city,country,po_box,fax,website,trn_no,logo) VALUES ('AB1236','ABD Limited', 'Road 1', 'Road 2','Bangalore','India','1234','2233','www.abc.com','9999','logo1');  
INSERT INTO company_lookup (company_id,company_name,address_1,address_2,city,country,po_box,fax,website,trn_no,logo) VALUES ('AB1237','ABE Limited', 'Road 1', 'Road 2','Bangalore','India','1234','2233','www.abc.com','9999','logo1');  


INSERT INTO product_category_lookup (category_id,category_name) VALUES ('11','Floral');
INSERT INTO product_category_lookup (category_id,category_name) VALUES ('22','Oriental');

INSERT INTO product_brand_lookup (brand_id,brand_name) VALUES ('22','Kanzo');
INSERT INTO product_brand_lookup (brand_id,brand_name) VALUES ('33','DKNY');

INSERT INTO product_type_lookup (type_id,type_name) VALUES ('44','Perfume1');
INSERT INTO product_type_lookup (type_id,type_name) VALUES ('55','Perfume2');

INSERT INTO product_coo_lookup (coo_id,coo_name) VALUES ('66','India');
INSERT INTO product_coo_lookup (coo_id,coo_name) VALUES ('77','Japan');

----------------------------------- 	
	