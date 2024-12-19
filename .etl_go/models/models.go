package models

import "github.com/google/uuid"

type Order struct {
	CustomerID uuid.UUID
	BookID     uuid.UUID
	Quantity   int
}

type Customer struct {
	CustomerID uuid.UUID
	UserName   string
}

type Book struct {
	BookID   uuid.UUID
	Title    string
	Price    float64
	Quantity int
}
