package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/jackc/pgx/v4"
)

// Define the structure to parse the Open Library response
type OpenLibraryResponse struct {
	Records map[string]struct {
		Title         string                  `json:"title"`
		Authors       []struct{ Name string } `json:"authors"`
		Publishers    []string                `json:"publishers"`
		PublishDate   string                  `json:"publish_date"`
		ISBN          []string                `json:"isbn_13"`
		NumberOfPages int                     `json:"number_of_pages"`
	} `json:"records"`
}

// Function to fetch book details from Open Library by ISBN
func fetchBookDataFromOpenLibrary(isbn string) (*OpenLibraryResponse, error) {
	url := fmt.Sprintf("https://openlibrary.org/api/volumes/brief/json/%s", isbn)
	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("error fetching book data: %v", err)
	}
	defer resp.Body.Close()

	var response OpenLibraryResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, fmt.Errorf("error decoding JSON response: %v", err)
	}

	return &response, nil
}

// Function to insert a book into the database
func insertBookIntoDatabase(conn *pgx.Conn, bookTitle, bookAuthor, bookPublisher, publishDate, isbn string, numPages int) error {
	// Insert the book into the `book` table
	_, err := conn.Exec(context.Background(), `
		INSERT INTO book (book_title, book_author, book_publisher, book_price, book_cuantity_in_stock, book_description) 
		VALUES ($1, $2, $3, 0.0, 10, 'Description not available')`,
		bookTitle, bookAuthor, bookPublisher)
	if err != nil {
		return fmt.Errorf("error inserting book into database: %v", err)
	}

	return nil
}

func main() {
	// Connect to the Postgres database
	conn, err := pgx.Connect(context.Background(), "postgresql://postgres:bdIIFinal19@localhost:5432/bkstoredb")
	if err != nil {
		log.Fatalf("Unable to connect to the database: %v", err)
	}
	defer conn.Close(context.Background())

	// Example ISBN (you can replace this with any valid ISBN)
	isbn := "9780140328721" // ISBN for the book "Charlotte's Web"

	// Fetch book data from Open Library API
	bookData, err := fetchBookDataFromOpenLibrary(isbn)
	if err != nil {
		log.Fatalf("Error fetching book data: %v", err)
	}

	// Check if the book data was fetched
	if len(bookData.Records) == 0 {
		log.Fatalf("No book found with ISBN %s", isbn)
	}

	// Extract the book details
	for _, record := range bookData.Records {
		bookTitle := record.Title
		bookAuthor := record.Authors[0].Name
		bookPublisher := record.Publishers[0]
		publishDate := record.PublishDate
		numPages := record.NumberOfPages
		bookISBN := record.ISBN[0]

		// Insert the book into the database
		err := insertBookIntoDatabase(conn, bookTitle, bookAuthor, bookPublisher, publishDate, bookISBN, numPages)
		if err != nil {
			log.Fatalf("Error inserting book into database: %v", err)
		}

		fmt.Printf("Book '%s' by %s successfully inserted into the database.\n", bookTitle, bookAuthor)
	}
}
