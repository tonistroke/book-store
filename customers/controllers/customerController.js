const { createCustomer, getCustomerByUserName, getAllCustomers, updateCustomer, deleteCustomer } = require('../models/customer');

// Create a new customer
const addCustomer = async (req, res) => {
  try {
    const { user_name, email, password } = req.body;
    const customer = await createCustomer(user_name, email, password);
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all customers
const getCustomers = async (req, res) => {
  try {
    const customers = await getAllCustomers();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get customer by username (from query params)
const getCustomer = async (req, res) => {
  try {
    const { customer_user_name } = req.query; // Access the query parameter
    if (!customer_user_name) {
      return res.status(400).json({ message: 'Username is required' });
    }
    
    const customer = await getCustomerByUserName(customer_user_name);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update customer
const updateCustomerDetails = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const { user_name, email, password } = req.body;
    
    const customer = await updateCustomer(customer_id, user_name, email, password);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete customer
const deleteCustomerById = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const deletedCustomer = await deleteCustomer(customer_id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted', customer: deletedCustomer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addCustomer, getCustomers, getCustomer, updateCustomerDetails, deleteCustomerById };
