const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const errorController = require('./controllers/errorController');

const app = express();

//MiddleWares

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.time = new Date().toISOString();
  next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'failed',
  //   message: `Can not find ${req.originalUrl} on this server!`
  // });
  // const err = new Error(`Can not find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Can not find ${req.originalUrl} on this server!`, 400)); // everytime when we pass an argument to next() it will get as an error and pass to next erro handling middleware
});

app.use(errorController);

// Start server

module.exports = app;
