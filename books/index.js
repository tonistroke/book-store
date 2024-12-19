const express = require('express');
const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const port = 5001;

// PostgreSQL client setup
const pgClient = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pgClient.connect();

app.use(express.json()); // Middleware to parse JSON bodies

// ---------------------------------------------
// Book CRUD Endpoints
// ---------------------------------------------

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const result = await pgClient.query('SELECT * FROM book');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ error: 'Error fetching books' });
  }
});

// Insert a new book
app.post('/api/book', async (req, res) => {
  const { book_title, book_price, book_author, book_publisher, book_year } = req.body;

  if (!book_title || !book_price || !book_author || !book_publisher || !book_year) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await pgClient.query(
      `INSERT INTO book (book_id, book_title, book_price, book_author, book_publisher, book_year)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [uuidv4(), book_title, book_price, book_author, book_publisher, book_year]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting book:', err);
    res.status(500).json({ error: 'Error inserting book' });
  }
});

// Update a book
app.put('/api/book', async (req, res) => {
  const { book_id, book_title, book_price, book_author, book_publisher, book_year } = req.body;

  if (!book_id || !book_title || !book_price || !book_author || !book_publisher || !book_year) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await pgClient.query(
      `UPDATE book 
      SET book_title = $1, book_price = $2, book_author = $3, book_publisher = $4, book_year = $5
      WHERE book_id = $6 RETURNING *`,
      [book_title, book_price, book_author, book_publisher, book_year, book_id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).json({ error: 'Error updating book' });
  }
});

// Delete a book
app.delete('/api/book', async (req, res) => {
  const { book_id } = req.query;

  if (!book_id) {
    return res.status(400).json({ error: 'Book ID is required' });
  }

  try {
    const result = await pgClient.query('DELETE FROM book WHERE book_id = $1 RETURNING *', [book_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).json({ error: 'Error deleting book' });
  }
});

// ---------------------------------------------
// Order Endpoint
// ---------------------------------------------

// Create a new order
app.post('/api/order', async (req, res) => {
  const { customer_id, order_items } = req.body; // order_items should be an array of { book_id, quantity }

  if (!customer_id || !order_items || order_items.length === 0) {
    return res.status(400).json({ error: 'Customer ID and order items are required' });
  }

  try {
    // Calculate the total price of the order
    let totalAmount = 0;
    const orderItemsWithDetails = [];

    for (const item of order_items) {
      const { book_id, quantity } = item;

      if (!book_id || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid book ID or quantity' });
      }

      const bookResult = await pgClient.query('SELECT * FROM book WHERE book_id = $1', [book_id]);

      if (bookResult.rowCount === 0) {
        return res.status(404).json({ error: `Book with ID ${book_id} not found` });
      }

      const book = bookResult.rows[0];
      const itemTotal = book.book_price * quantity;
      totalAmount += itemTotal;

      orderItemsWithDetails.push({
        book_id,
        quantity,
        item_total: itemTotal,
      });
    }

    // Create the order
    const orderResult = await pgClient.query(
      `INSERT INTO "order" (order_id, customer_id, order_date) 
       VALUES ($1, $2, CURRENT_DATE) RETURNING *`,
      [uuidv4(), customer_id]
    );

    const order_id = orderResult.rows[0].order_id;

    // Insert order items
    for (const item of orderItemsWithDetails) {
      await pgClient.query(
        `INSERT INTO order_items (order_items_id, order_id, book_id, order_items_cuantity)
         VALUES ($1, $2, $3, $4)`,
        [uuidv4(), order_id, item.book_id, item.quantity]
      );
    }

    res.status(201).json({
      message: 'Order created successfully',
      order_id,
      totalAmount,
      order_items: orderItemsWithDetails,
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Error creating order' });
  }
});

// ---------------------------------------------
// Start the server
// ---------------------------------------------

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
