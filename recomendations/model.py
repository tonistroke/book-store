import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# Cargar datos
data = pd.DataFrame({
    "Libro": ["Libro A", "Libro B", "Libro C", "Libro D", "Libro E"],
    "Ventas Mensuales": [500, 150, 2000, 50, 300],
    "Precio": [15.99, 9.99, 25.00, 7.99, 12.50]
})

# Normalizar las columnas numéricas
scaler = StandardScaler()
data_scaled = scaler.fit_transform(data[["Ventas Mensuales", "Precio"]])

# Aplicar K-means
kmeans = KMeans(n_clusters=3, random_state=42)
data["Cluster"] = kmeans.fit_predict(data_scaled)

# Visualizar resultados
plt.scatter(data["Ventas Mensuales"], data["Precio"], c=data["Cluster"], cmap="viridis", s=100)
plt.xlabel("Ventas Mensuales")
plt.ylabel("Precio")
plt.title("Clusters de Libros")
plt.show()

# Mostrar agrupaciones
print(data)
