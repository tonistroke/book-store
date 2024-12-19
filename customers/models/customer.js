const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

// Create a new customer
const createCustomer = async (user_name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const customer_id = uuid.v4();
  
  const query = `
    INSERT INTO customer (customer_id, customer_user_name, customer_email, customer_password)
    VALUES ($1, $2, $3, $4)
    RETURNING customer_id, customer_user_name, customer_email
  `;
  const values = [customer_id, user_name, email, hashedPassword];
  
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Get customer by username
const getCustomerByUserName = async (customer_user_name) => {
  const query = 'SELECT * FROM customer WHERE customer_user_name = $1';
  const values = [customer_user_name];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Get all customers
const getAllCustomers = async () => {
  const query = 'SELECT * FROM customer';
  const result = await pool.query(query);
  return result.rows;
};

// Update a customer's details
const updateCustomer = async (customer_id, user_name, email, password) => {
  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const query = `
    UPDATE customer
    SET 
      customer_user_name = COALESCE($2, customer_user_name),
      customer_email = COALESCE($3, customer_email),
      customer_password = COALESCE($4, customer_password)
    WHERE customer_id = $1
    RETURNING customer_id, customer_user_name, customer_email
  `;
  const values = [customer_id, user_name, email, hashedPassword];
  
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Delete a customer by ID
const deleteCustomer = async (customer_id) => {
  const query = 'DELETE FROM customer WHERE customer_id = $1 RETURNING *';
  const values = [customer_id];
  
  const result = await pool.query(query, values);
  return result.rows[0]; // Return deleted customer details, or null if not found
};

module.exports = { createCustomer, getCustomerByUserName, getAllCustomers, updateCustomer, deleteCustomer };
