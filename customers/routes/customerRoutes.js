const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Create a new customer
router.post('/customer', customerController.addCustomer);

// Get all customers
router.get('/customers', customerController.getCustomers);

// Get customer by username (query parameter)
router.get('/customer', customerController.getCustomer);

// Update customer details
router.put('/customer/:customer_id', customerController.updateCustomerDetails);

// Delete customer by ID
router.delete('/customer/:customer_id', customerController.deleteCustomerById);

module.exports = router;
