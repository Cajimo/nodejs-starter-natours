class AppError extends Error {
  constructor(message, statusCode) {
    /**
     * Calling the parent class Error, and whatever we pass into it
     * is gonna be the message property and with that we set the
     * message property to our incoming message.
     */
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'Oh no!' : 'error';
    this.isOperational = true;
    //"captureStackTrace" captures all error details
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;
