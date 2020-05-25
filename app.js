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
// Just a demonstration.
app.use((req, res, next) => {
  console.log('Hola desde middleware');
  next();
});
// Getting req date.
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//ROUTERS
// Creating route paths.
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
module.exports = app;
