const dotenv = require('dotenv');
const mongoose= require('mongoose');
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
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});