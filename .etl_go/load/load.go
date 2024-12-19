package load

import (
	"database/sql"
	"fmt"
	"myapp/models"
)

// LoadData inserts the recommendation groups and updates customers and books
func LoadData(db *sql.DB, clusters map[int][]models.Order, customers []models.Customer, books []models.Book) error {
	// Insert recomend_group into DB
	for clusterID, orders := range clusters {
		recommendationGroupName := fmt.Sprintf("Cluster_%d", clusterID)

		// Create a new recommendation group
		var recomendGroupID int
		err := db.QueryRow(
			`INSERT INTO recomend_group (recomend_group_name) VALUES ($1) RETURNING recomend_group_id`,
			recommendationGroupName,
		).Scan(&recomendGroupID)
		if err != nil {
			return err
		}

		// Insert customer into the recomend group
		for _, order := range orders {
			_, err := db.Exec(
				`UPDATE customer SET recomend_group_id = $1 WHERE customer_id = $2`,
				recomendGroupID, order.CustomerID,
			)
			if err != nil {
				return err
			}
		}

		// Insert books into the recomend group
		for _, order := range orders {
			_, err := db.Exec(
				`INSERT INTO book_group (recomend_group_id, book_id) VALUES ($1, $2)`,
				recomendGroupID, order.BookID,
			)
			if err != nil {
				return err
			}
		}
	}

	return nil
}
