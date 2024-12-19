const express = require('express');
const axios = require('axios');
const { Client } = require('pg');
require('dotenv').config();

const app = express();
const port = 3000;

// PostgreSQL Client setup (ensure this is only declared once)
const pgClient = new Client({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

pgClient.connect();

// Open Library API Setup
const openLibraryAPI = 'https://openlibrary.org/search.json';

// Fetch Books from Open Library and insert into Postgres
async function fetchAndInsertBooks(query) {
  try {
    // Fetch data from Open Library API
    const response = await axios.get(openLibraryAPI, {
      params: { q: query },
    });

    // Extract books data
    const books = response.data.docs;

    for (const book of books) {
      const {
        title,
        author_name,
        publisher,
        cover_i,
        price,
      } = book;

      // Prepare data for insertion
      const bookData = {
        book_title: title,
        book_author: author_name ? author_name.join(', ') : null,
        book_publisher: publisher ? publisher.join(', ') : null,
        book_img_large: `https://covers.openlibrary.org/b/id/${cover_i}-L.jpg`,
        book_img_medium: `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`,
        book_img_small: `https://covers.openlibrary.org/b/id/${cover_i}-S.jpg`,
        book_price: price || 0.0,
        book_cuantity_in_stock: 10, // Default value
        book_description: 'No description available', // Default value
      };

      // Insert book into Postgres database
      await pgClient.query(
        `INSERT INTO book (book_title, book_author, book_publisher, book_img_large, book_img_medium, book_img_small, book_price, book_cuantity_in_stock, book_description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          bookData.book_title,
          bookData.book_author,
          bookData.book_publisher,
          bookData.book_img_large,
          bookData.book_img_medium,
          bookData.book_img_small,
          bookData.book_price,
          bookData.book_cuantity_in_stock,
          bookData.book_description,
        ]
      );
    }

    console.log('Books data inserted into PostgreSQL successfully!');
  } catch (error) {
    console.error('Error fetching or inserting books:', error);
  }
}

// API Endpoint to trigger the book insertion
app.get('/load-books', async (req, res) => {
  const query = req.query.q || 'javascript'; // Default query if none provided
  await fetchAndInsertBooks(query);
  res.send('Books data is being loaded into PostgreSQL...');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
