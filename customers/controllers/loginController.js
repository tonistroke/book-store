const bcrypt = require('bcryptjs');
const pool = require('../config/db');

// Handle login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Fetch customer by username (NOT customer_id)
    const query = 'SELECT * FROM customer WHERE customer_user_name = $1';
    const values = [username];
    const result = await pool.query(query, values);

    const customer = result.rows[0];
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    // Compare hashed password
    const isMatch = await bcrypt.compare(password, customer.customer_password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Successfully logged in
    res.status(200).json({ message: 'Login successful', customer_id: customer.customer_id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login };
