package transform

import (
	"fmt"
	"myapp/models"
)

// KMeans clusters customers based on buying behavior
func KMeans(orders []models.Order) map[int][]models.Order {
	// Initialize clusters: we will group into 3 clusters
	clusters := make(map[int][]models.Order)

	// Dummy K-means: just distributing orders into clusters (you can implement actual K-means logic here)
	for i, order := range orders {
		clusterID := i % 3 // Group into 3 clusters for simplicity
		clusters[clusterID] = append(clusters[clusterID], order)
	}

	// Output the cluster sizes
	for clusterID, orders := range clusters {
		fmt.Printf("Cluster %d: %d orders\n", clusterID, len(orders))
	}

	return clusters
}
