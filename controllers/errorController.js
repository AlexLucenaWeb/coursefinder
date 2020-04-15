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


//Development errors:
const sendDevError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

//Droduction errors:
const sendProError = (err, res) => {
    // Operational error, send message to client
    if (err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } 
    // Programming or unknown error, dont send error to client
    else {
        //Log the error:
        console.error('ERROR', err);

        //Send message:
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong :('
        });
    };
};

module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Error in dev or pro
    if (process.env.NODE_ENV === 'development'){
        sendDevError(err, res);
    } else if (process.env.NODE_ENV === 'production'){
        let error = { ...err};
        
        // Invalid id error:
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        // Duplicate field error:
        if (error.code === 11000) error = handleDuplicateFidErrorDB(error);
        // Update error:
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

        sendProError(error, res);
    }
};
