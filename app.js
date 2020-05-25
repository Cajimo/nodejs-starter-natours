//3rd party Modules
const express = require('express');
const morgan = require('morgan');
//My modules
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//!MIDDLEWARES
// Global variables --> dev or prod
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// .json() parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());
// .static() The function determines the file to serve by combining req.url with the provided root directory.
// The __dirname in a node script returns the path of the folder where the current JavaScript file resides.
app.use(express.static(`${__dirname}/public`));

// Getting req date.
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//ROUTERS
// Creating route paths.
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//Routes handler.
// If we are able to reach this point here that it means that the  request response cycle
// was not yet finished at this point in our code
app.all('*', (req, res, next) => {
  /* res.status(404).json({
    status: 'fallo',
    mensaje: `No se encuentra ${req.originalUrl} en este servidor!`,
  }); */
  //Creating an error!
  const err = new Error(`No se encuentra ${req.originalUrl} en este servidor!`);
  err.status = 'Ha habido un fallo!';
  err.statusCode = 404;
  // Express it will assume that it is an error and it will skip all
  // the other middlewares in the middleware stack and then send the error
  // that we passed in to our global error handling middleware
  next(err);
});

// ERROR Handler middleware for all errors.
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
