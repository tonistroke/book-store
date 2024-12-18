const express = require('express');
const router = express.Router();
const { addCustomer, getCustomers, getCustomer, addCustomerList, getCustomerListsByCustomerId, deleteCustomerListById } = require('../controllers/customerController');

// Routes for customers and customer lists
router.post('/customer', addCustomer);
router.get('/customers', getCustomers);
router.get('/customer/:customer_id', getCustomer);
router.post('/customer/:customer_id/list', addCustomerList);
router.get('/customer/:customer_id/lists', getCustomerListsByCustomerId);
router.delete('/customer/list/:customer_list_id', deleteCustomerListById);

module.exports = router;
