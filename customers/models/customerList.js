const pool = require('../config/db');
const uuid = require('uuid');

// Create a new customer list
const createCustomerList = async (customer_id, list_name) => {
  //const customer_list_id = uuid.v4();
  
  const query = `
    INSERT INTO customer_list (customer_id, customer_list_name)
    VALUES ($1, $2)
    RETURNING customer_list_id, customer_list_name
  `;
  
  const values = [/*customer_list_id,*/ customer_id, list_name];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Get all customer lists by customer id
const getCustomerLists = async (customer_id) => {
  const query = 'SELECT * FROM customer_list WHERE customer_id = $1';
  const values = [customer_id];
  const result = await pool.query(query, values);
  return result.rows;
};

// Delete a customer list
const deleteCustomerList = async (customer_list_id) => {
  const query = 'DELETE FROM customer_list WHERE customer_list_id = $1';
  const values = [customer_list_id];
  const result = await pool.query(query, values);
  return result.rowCount;
};

module.exports = { createCustomerList, getCustomerLists, deleteCustomerList };
