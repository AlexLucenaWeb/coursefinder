const sendDevError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

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
        sendProError(err, res);
    }
};
