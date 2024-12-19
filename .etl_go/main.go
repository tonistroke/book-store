package main

import (
	"database/sql"
	"fmt"
	"log"
	"myapp/database" // import the database package
)

func main() {
	// Assume `db` is your SQL database connection
	var db *sql.DB // You should initialize your db connection properly

	// Call the exported ExtractData function
	orders, customers, books, err := database.ExtractData(db)
	if err != nil {
		log.Fatal("Error extracting data: ", err)
	}

	// Process the extracted data
	fmt.Println("Orders:", orders)
	fmt.Println("Customers:", customers)
	fmt.Println("Books:", books)
}
