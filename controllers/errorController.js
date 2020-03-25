const AppError = require('./../utils/appError');

const handleCastErrorDb = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  //console.log('this is the VALuueeee ,', value);
  const message = `Duplicate field value: ${value} please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const msgErrorArray = Object.values(err.errors).map(el => el.message);
  const message = `Invalid fields ${msgErrorArray.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTerror = err => {
  if (err.name === 'JsonWebTokenError')
    return new AppError('Invalid token. Please log in again', 401);
  if (err.name === 'TokenExpiredError')
    return new AppError('Expired token. Please log in again', 401);
};

/*************************DEVELOPMENT ERROR********************************* */
/* eslint-disable no-else-return */
const sendErrDev = (err, req, res) => {
  //A)API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  //B)RENDERED WEBSITE
  //console.log(err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
};

/*****************************PRODUCTION ERROR************************************ */
const sendErrProd = (err, req, res) => {
  //operation trusted error: send the message to the client
  //console.error(err);
  //A) API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
      // eslint-disable-next-line no-else-return
    }
    // unstrusted programming error or unknown error: Doest not leak to client
    //send generic message to client
    return res.status(404).json({
      status: 'Error',
      message: 'Something went very wrong :( !'
    });
  }
  //B) RENDERED WEBSITE
  //operation trusted error: send the message to the client
  //onsole.error(err);
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrongaaaaaaaaaa!',
      msg: err.message
    });
  }
  // unstrusted programming error or unknown error: Doest not leak to client
  //send generic message to client
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!!',
    msg: 'Please Try Again Later :('
  });
};
module.exports = (err, req, res, next) => {
  //console.log(err);
  err.statusCode = err.statusCode || 500;
  //console.log(err.statusCode);
  err.status = err.status || 'error';
  //console.log(err.status);

  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, req, res);
  }
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    //console.log(error.name);
    error.message = err.message;
    if (error.name === 'CastError') error = handleCastErrorDb(error);
    if (error.code === 11000) error = handleDuplicateErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTerror(error);
    if (error.name === 'TokenExpiredError') error = handleJWTerror(error);
    //console.log(error);
    sendErrProd(error, req, res);
  }
};
