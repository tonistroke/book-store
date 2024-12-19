CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "book" (
	book_id UUID DEFAULT uuid_generate_v4(),
	book_title VARCHAR(250),
	book_price DECIMAL(10,2),
	book_author VARCHAR(250),
	book_publisher VARCHAR(250),
	book_year INT,

	PRIMARY KEY (book_id)
);


CREATE TABLE "customer" (
	customer_id UUID DEFAULT uuid_generate_v4(),
	customer_user_name VARCHAR(50) UNIQUE NOT NULL,
	customer_password TEXT NOT NULL,
	customer_email VARCHAR(100) UNIQUE,

	PRIMARY KEY (customer_id)
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

-- ____________________________________________________________________________

CREATE TABLE "recomend_group" (
	recomend_group_id SERIAL,
	recomend_group_name VARCHAR(100),

	PRIMARY KEY (recomend_group_id)
);

CREATE TABLE "book_group" (
	book_group_id SERIAL,
	recomend_group_id INTEGER,
	book_id UUID,

	PRIMARY KEY (book_group_id),
	FOREIGN KEY (recomend_group_id) REFERENCES recomend_group(recomend_group_id),
	FOREIGN KEY (book_id) REFERENCES book(book_id)
);

ALTER TABLE "customer"
ADD COLUMN recomend_group_id INTEGER;

ALTER TABLE "customer"
ADD FOREIGN KEY (recomend_group_id)
REFERENCES "recomend_group"(recomend_group_id);




-- ____________________________________________________________________________

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
/*

-- | customers | orders |
CREATE VIEW customers_lists AS
SELECT C.customer_user_name AS Usuario, CL.customer_list_name AS Lista
FROM customer C
JOIN customer_list CL ON C.customer_id = CL.customer_id
;

-- | customer | orders |
SELECT C.customer_user_name AS Usuario, CL.customer_list_name AS Lista
FROM customer C
JOIN customer_list CL ON C.customer_id = CL.customer_id
;
-- | customer | list | book |
-- SELECT * 

SELECT * FROM customer;
*/