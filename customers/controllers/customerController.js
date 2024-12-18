const { createCustomer, getCustomerById, getAllCustomers } = require('../models/customer');
const { createCustomerList, getCustomerLists, deleteCustomerList } = require('../models/customerList');

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

// Get customer by ID
const getCustomer = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const customer = await getCustomerById(customer_id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a list to a customer
const addCustomerList = async (req, res) => {
  try {
    const { customer_id, list_name } = req.body;
    const list = await createCustomerList(customer_id, list_name);
    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all lists of a customer
const getCustomerListsByCustomerId = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const lists = await getCustomerLists(customer_id);
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a list of a customer
const deleteCustomerListById = async (req, res) => {
  try {
    const { customer_list_id } = req.params;
    const result = await deleteCustomerList(customer_list_id);
    if (result === 0) {
      return res.status(404).json({ message: 'Customer list not found' });
    }
    res.status(200).json({ message: 'Customer list deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addCustomer, getCustomers, getCustomer, addCustomerList, getCustomerListsByCustomerId, deleteCustomerListById };
