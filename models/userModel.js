const mongoose = require ('mongoose');
const validator = require ('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name!']
    },
    email: {
        type: String,
        required: [true, 'please enter your email address!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please provide a valid email address']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'please enter a password'],
        minlength: 8
    },
    confirmPassword: {
        type: String,
        required: [true, 'you must confirm your password!'],

    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;