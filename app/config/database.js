const mongoose = require('mongoose');

const connect = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    };
    await mongoose.connect(uri, options);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.log('MongoDB connection error:', error);
  }
};

module.exports = {
  connect,
};
