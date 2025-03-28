const express = require('express');
const cors = require('cors');
const connectDB = require('./config/mongoAtlas');
const disasterRoutes = require('./routes/disasters');
const errorHandler = require('./middleware/error');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// Database Connection
connectDB();

// Routes
app.use('/api/disasters', disasterRoutes);

// Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;