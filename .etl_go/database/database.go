package database

import (
	"database/sql"
	"myapp/models" // import the models package

	_ "github.com/jackc/pgx/v4/stdlib" // for PostgreSQL driver
	_ "github.com/lib/pq"
)

// EXTRACT Data from Postgres DB (Function name changed to ExtractData)
func ExtractData(db *sql.DB) ([]models.Order, []models.Customer, []models.Book, error) {
	// Fetch orders and join with the order table to get customer_id
	ordersQuery := `
		SELECT o.customer_id, oi.book_id, oi.order_items_cuantity 
		FROM "order_items" oi
		JOIN "order" o ON oi.order_id = o.order_id
	`
	rows, err := db.Query(ordersQuery)
	if err != nil {
		return nil, nil, nil, err
	}
	defer rows.Close()

	var orders []models.Order
	for rows.Next() {
		var order models.Order
		if err := rows.Scan(&order.CustomerID, &order.BookID, &order.Quantity); err != nil {
			return nil, nil, nil, err
		}
		orders = append(orders, order)
	}

	// Fetch customers
	customersQuery := `SELECT customer_id, customer_user_name FROM "customer"`
	rows, err = db.Query(customersQuery)
	if err != nil {
		return nil, nil, nil, err
	}
	defer rows.Close()

	var customers []models.Customer
	for rows.Next() {
		var customer models.Customer
		if err := rows.Scan(&customer.CustomerID, &customer.UserName); err != nil {
			return nil, nil, nil, err
		}
		customers = append(customers, customer)
	}

	// Fetch books
	booksQuery := `SELECT book_id, book_title, book_price, book_cuantity_in_stock FROM "book"`
	rows, err = db.Query(booksQuery)
	if err != nil {
		return nil, nil, nil, err
	}
	defer rows.Close()

	var books []models.Book
	for rows.Next() {
		var book models.Book
		if err := rows.Scan(&book.BookID, &book.Title, &book.Price, &book.Quantity); err != nil {
			return nil, nil, nil, err
		}
		books = append(books, book)
	}

	return orders, customers, books, nil
}
