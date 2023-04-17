require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Connect to MongoDB Atlas database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB Atlas!');
})
.catch(error => {
  console.error('Error connecting to MongoDB Atlas:', error.message);
});

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming request bodies in JSON format
app.use(bodyParser.json());

// Import and use routes from controller
const blogRoutes = require('./controllers/blog');

app.use('/blogs', blogRoutes);

// Handle errors
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
