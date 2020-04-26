const dotenv = require('dotenv');
const mongoose= require('mongoose');

// //uncaught exception
process.on('uncaughtException', err => {
    console.log('Uncaught exception, shutting down....');
    console.log(err.name, err.message);
    //Shut down the app
    process.exit(1);
});

dotenv.config({path:'./config.env'});
const app = require('./app');

//DATABASE
const DB= process.env.DATABASE.replace(
    '<PASSWORD>', 
    process.env.DATABASE_PASSWORD
);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(()=> console.log('DB connection successful!'));

//SERVER
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

//Unhandle rejections
process.on('unhandledRejection', err => {
    console.log('Unhandled rejection, shutting down....');
    console.log(err.name, err.message);
    
    //Close the server and shut down the app
    server.close(() =>{
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('SIGTERM RECIVED, shutting down');
    server.close(() =>{
        console.log('Process finished');
    });
});