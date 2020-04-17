const express = require('express');
const morgan = require('morgan');


//import error class & controller
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
//import routes:
const courseRouter = require('./routes/courseRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

//middleware: 
console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
};

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});


//Routes
//When the route is requested, the middleware router is called:
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//ERR: Not define route:
app.all('*',(req, res, next) =>{
    next(new AppError(`Can´t find ${req.originalUrl} on this server!`, 404));
});

//Error handling middlwr
app.use(globalErrorHandler);

module.exports = app;