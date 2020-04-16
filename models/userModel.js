const mongoose = require ('mongoose');
const validator = require ('validator');
const bcrypt = require('bcryptjs');

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
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'please enter a password'],
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'you must confirm your password!'],
        validate: {
            validator: function(el) {
                return el === this.password; 
            },
            message:'Passwords do no match!'
        }
     },
     passwordChangedAt: Date
});

userSchema.pre('save', async function(next) {
    //only run this function if password was changed
    if(!this.isModified('password')) return next();

    //hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // delete confirm password field
    this.confirmPassword = undefined;
    next();
});

userSchema.methods.correctPassword = async function(
    candidatePassword, 
    userPassword
    ) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        console.log(changedTimestamp, JWTTimestamp);
        return JWTTimestamp < changedTimestamp;
    }
    
    // False means not changed
    return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;