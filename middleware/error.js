const ErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
  
    // Log error message to console
    console.error(err.stack);
  
    res.status(statusCode).json({ message });
  };

  module.exports = {
    ErrorHandler
  }