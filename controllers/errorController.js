//Require Error class
const AppError = require('./../utils/appError')

//DB errors.
//1- Invalid query field
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message, 400);
};

//2- Duplicate field in DB
const handleDuplicateFidErrorDB = err => {
  //Error value extrator with regular expression
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field: ${value} Please use another value`
  return new AppError(message, 400);
}

//3- Invalid update fields: name, average rating, type and dificultty:
const handleValidationErrorDB = err => {
  //Take error message fromn each field:
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token! Please log in again', 401);

const handleJWTEXpiredError = () => new AppError('Your token has expired! Please log in again!', 401);

//Development errors:
const sendDevError = (err, req, res) => {
  //1. API errors
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  //2. Error page
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
};

//Production errors:
const sendProError = (err, req, res) => {
  //1. API errors
  if (req.originalUrl.startsWith('/api')) {
    // Operational error, send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Programming or unknown error, dont send error to client
    else {
      //Send message:
      return res.status(500).json({
        status: 'error',
        message: 'Something went wrong! :('
      });
    };
  }

  // 2. Website errors
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  } else {
    // 2) Send generic message
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: 'Sorry, we can\'t render this page at the moment. Please try again later.'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Error in dev or pro
  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err};
    error.message = err.message;

    // Invalid id error:
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    // Duplicate field error:
    if (error.code === 11000) error = handleDuplicateFidErrorDB(error);
    // Update error:
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    //json web token error:
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    // jwt expired error:
    if (error.name === 'TokenExpiredError') error = handleJWTEXpiredError();
    sendProError(error, req, res);
  }
};