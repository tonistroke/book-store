CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "book" (
	book_id UUID DEFAULT uuid_generate_v4(),
	book_title VARCHAR(150),
	book_img_large TEXT,
	book_img_medium TEXT,
	book_img_small TEXT,
	book_price DECIMAL(10,2),
	book_author VARCHAR(150),
	book_publisher VARCHAR(150),
	book_cuantity_in_stock INT,
	book_description TEXT,

	PRIMARY KEY (book_id)
);


CREATE TABLE "customer" (
	customer_id UUID DEFAULT uuid_generate_v4(),
	customer_user_name VARCHAR(50) UNIQUE NOT NULL,
	customer_password TEXT NOT NULL,
	customer_email VARCHAR(100) UNIQUE,

	PRIMARY KEY (customer_id)
);

INSERT INTO customer (customer_user_name, customer_email, customer_password) VALUES
('tonssi', 'esmailuasd', 'spass'),
('tonis', 'emailsdu', 'pass'),
('toniasd', 'emailasdu', 'pass'),
('tonisds', 'emailasd', 'pass'),
('tonssi', 'emaasdlu', 'pass')
;

CREATE TABLE "customer_list" (
	customer_list_id UUID DEFAULT uuid_generate_v4(),
	customer_id UUID NOT NULL,
	customer_list_name VARCHAR(50) NOT NULL,

	PRIMARY KEY (customer_list_id),
	FOREIGN KEY (customer_id) REFERENCES "customer"(customer_id)
);

CREATE TABLE "order" (
	order_id UUID DEFAULT uuid_generate_v4(),
	customer_id UUID NOT NULL,
	order_date DATE,

	PRIMARY KEY (order_id),
	FOREIGN KEY (customer_id) REFERENCES "customer"(customer_id)
);

CREATE TABLE "order_items" (
	order_items_id UUID DEFAULT uuid_generate_v4(),
	order_id UUID,
	book_id UUID,
	order_items_cuantity INT,

	PRIMARY KEY (order_items_id),
	FOREIGN KEY (order_id) REFERENCES "order"(order_id),
	FOREIGN KEY (book_id) REFERENCES "book"(book_id)
);


/*
SELECT * FROM user
WHERE id::text = '33bb9554-c616-42e6-a9c6-88d3bba4221c' 
  OR uid = '33bb9554-c616-42e6-a9c6-88d3bba4221c';
*/

CREATE OR REPLACE PROCEDURE uuid_customer(user_name TEXT)
AS
$$
DECLARE
    user_id UUID;
BEGIN
    SELECT customer_id INTO user_id
    FROM customer
    WHERE customer_user_name = user_name;

    -- Optionally, raise a notice for debugging
    RAISE NOTICE 'Customer ID: %', user_id;
END;
$$ LANGUAGE 'plpgsql';


-- | customers | lists |
CREATE VIEW customers_lists AS
SELECT C.customer_user_name AS Usuario, CL.customer_list_name AS Lista
FROM customer C
JOIN customer_list CL ON C.customer_id = CL.customer_id
;

-- | customer | lists |
SELECT C.customer_user_name AS Usuario, CL.customer_list_name AS Lista
FROM customer C
JOIN customer_list CL ON C.customer_id = CL.customer_id
;
-- | customer | list | book |
-- SELECT * 