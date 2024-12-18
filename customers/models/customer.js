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

// Get customer by id
const getCustomerById = async (customer_id) => {
  const query = 'SELECT * FROM customer WHERE customer_id = $1';
  const values = [customer_id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Get all customers
const getAllCustomers = async () => {
  const query = 'SELECT * FROM customer';
  const result = await pool.query(query);
  return result.rows;
};

module.exports = { createCustomer, getCustomerById, getAllCustomers };
