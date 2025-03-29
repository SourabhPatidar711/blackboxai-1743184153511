// Comprehensive error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log the error details
  console.error('\x1b[31m%s\x1b[0m', `[ERROR] ${err.message}`);
  console.error(err.stack);

  // Determine status code
  const statusCode = err.statusCode || 500;
  
  // Prepare error response
  const errorResponse = {
    success: false,
    status: statusCode,
    message: err.message || 'Internal Server Error',
  };

  // Include stack trace in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    errorResponse.message = 'Validation Error';
    errorResponse.errors = {};
    for (const field in err.errors) {
      errorResponse.errors[field] = err.errors[field].message;
    }
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    errorResponse.message = 'Duplicate Field Value Entered';
  }

  // Send JSON response
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;