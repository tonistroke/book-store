customers CRUD API endpoints:

GET /customers

POST /customer (insert a new customer)

GET /customer/{customer_id}

DELETE /customer/{customer_id}

GET /customer/{customer_id}/list/{list_id} (get one customer list of books)

POST /customer/{customer_id}/list/{list_id} (Create a customer list of books)

DELETE /customer/{customer_id}/list/{list_id} (Delete a customer list of books)

GET /customer/{customer_id}/lists (Get all the customer_id book list)

GET /lists (Get all the lists of books)

GET /login (for log in) and redirect to --> GET /customer/{log in customer_id}
