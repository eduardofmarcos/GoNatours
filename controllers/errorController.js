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

/* eslint-disable no-else-return */
const sendErrDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrProd = (err, res) => {
  //operation trusted error: send the message to the client
  console.log(err);
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
    // eslint-disable-next-line no-else-return
    // unstrusted programming error or unknown error: Doest not leak to client
  } else {
    //console.error('ERROR: ', err);
    //console.log(err);
    //send generic message to client
    return res.status(404).json({
      status: 'Error',
      message: 'Something went very wrong :( !'
    });
  }
};

module.exports = (err, req, res, next) => {
  //console.log(err);
  err.statusCode = err.statusCode || 500;
  //console.log(err.statusCode);
  err.status = err.status || 'error';
  //console.log(err.status);

  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  }
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDb(error);
    if (error.code === 11000) error = handleDuplicateErrorDB(error);
    //console.log(error);
    sendErrProd(error, res);
  }
};
