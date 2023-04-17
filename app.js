// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

// Import middleware
const authMiddleware = require('./middlewares/authMiddleware');
const errorMiddleware = require('./middlewares/errorMiddleware');

// Import database connection
const { connectDB } = require('./config/database');

// Create express app
const app = express();

// Configure app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

// Connect to database
connectDB();

// Use routes
app.use('/auth', authRoutes);
app.use('/users', authMiddleware.verifyToken, userRoutes);
app.use('/blogs', authMiddleware.verifyToken, blogRoutes);

// Handle errors
app.use(errorMiddleware.handle404);
app.use(errorMiddleware.handleError);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
