const express = require('express');
const bodyParser = require('body-parser');
const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/api', customerRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
