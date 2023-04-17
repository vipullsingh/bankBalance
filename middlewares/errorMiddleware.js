const { HttpException } = require('../exceptions');

const errorMiddleware = (err, req, res, next) => {
  // Check if error is an HttpException
  if (err instanceof HttpException) {
    return res.status(err.status).json({ message: err.message });
  }

  // Log error
  console.error(err);

  // Handle all other errors
  return res.status(500).json({ message: 'Internal Server Error' });
};

module.exports = errorMiddleware;
