const { Pool } = require('pg');
const fetch = require('node-fetch');
const KMeans = require('kmeans');

// PostgreSQL Connection Configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// EXTRACT: Fetch data from PostgreSQL
const extractData = async () => {
  const client = await pool.connect();
  try {
    // Fetch orders, customers, and books data
    const ordersRes = await client.query(`
      SELECT o.order_id, o.customer_id, oi.book_id, oi.order_items_cuantity
      FROM "order" o
      JOIN "order_items" oi ON o.order_id = oi.order_id
    `);

    const booksRes = await client.query(`
      SELECT book_id, book_title, book_author
      FROM "book"
    `);

    const customersRes = await client.query(`
      SELECT customer_id, customer_user_name
      FROM "customer"
    `);

    return { orders: ordersRes.rows, books: booksRes.rows, customers: customersRes.rows };
  } finally {
    client.release();
  }
};

// TRANSFORM: Apply K-means clustering
const transformData = (orders, books, customers) => {
  const orderData = orders.map(order => ({
    customer_id: order.customer_id,
    book_id: order.book_id,
    quantity: order.order_items_cuantity
  }));

  // Prepare the data for K-means
  const dataForKMeans = orderData.map(order => [
    order.customer_id, // Customer feature
    order.book_id,     // Book feature
    order.quantity     // Quantity feature
  ]);

  // Apply K-means clustering
  const kmeans = new KMeans();
  const result = kmeans.cluster(dataForKMeans, { k: 3 }); // Example: 3 clusters

  return result;
};

// LOAD: Store the result in PostgreSQL
const loadData = async (clusters) => {
  const client = await pool.connect();
  try {
    // Store recommendation groups
    const groupNames = clusters.map((group, index) => `Group ${index + 1}`);
    const resGroups = await client.query(`
      INSERT INTO "recomend_group" (recomend_group_name)
      VALUES ($1) RETURNING recomend_group_id
    `, [groupNames]);

    // Map each customer to a recommendation group
    clusters.forEach(async (cluster, index) => {
      const groupId = resGroups.rows[index].recomend_group_id;
      cluster.forEach(async (customer) => {
        await client.query(`
          UPDATE "customer"
          SET recomend_group_id = $1
          WHERE customer_id = $2
        `, [groupId, customer.customer_id]);
      });
    });

    // Map books to the appropriate recommendation group
    clusters.forEach(async (cluster, index) => {
      cluster.forEach(async (customer) => {
        const bookIds = customer.books.map(book => book.book_id);
        bookIds.forEach(async (bookId) => {
          await client.query(`
            INSERT INTO "book_group" (recomend_group_id, book_id)
            VALUES ($1, $2)
          `, [groupId, bookId]);
        });
      });
    });

  } finally {
    client.release();
  }
};

// Main ETL function
const runETL = async () => {
  try {
    const { orders, books, customers } = await extractData();
    const clusters = transformData(orders, books, customers);
    await loadData(clusters);
  } catch (error) {
    console.error('ETL process failed', error);
  }
};

// Call the ETL process
runETL();
