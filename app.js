const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require ('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');

//import error class & controller
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
//import routes:
const courseRouter = require('./routes/courseRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


//Global middleware:
//serving static files
app.use(express.static(path.join(__dirname, 'public')));

//Set Security HTTP Headers
app.use(helmet())

//Development logging
console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
};

//Lmiit Requests from the same API
const Limiter = rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again later'
});

app.use('/api', Limiter)

//Body Parser (reading data from body into req.body)
app.use(express.json({ limit: '10kb' }));

//Data sanitization against noSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS attacks
app.use(xss());

//prevent paramater pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingAverage',
        'ratingQuantity',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}));


//test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});


//Routes
//When the route is requested, the middleware router is called:
app.use('/', viewRouter);
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