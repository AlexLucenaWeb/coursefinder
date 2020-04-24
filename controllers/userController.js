const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const basic = require('./basicHandler');

const filterObject = (obj, ...allowedFields)=> {
    const newObject = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObject[el] =obj[el]; 
    })
    return newObj;
}

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.updateMe = catchAsync (async (req, res, next) => {
    //1. create error if users tries to update the password
    if (req.body.password || req.body.confirmPassword) {
        return next(new AppError('Unavailable! To update your password, please go to updateMyPassword!', 400))
    }
    //2. Filter out unwanted field names
    const filteredFields = filterObject(req.body, 'name', 'email');

    //3. Update user
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredFields, {
        new: true, 
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

exports.deleteMe = catchAsync(async( req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
})

exports.createUser = (req, res) => {
    res.status(500).json({
        status : 'error', 
        message: 'This route is not defined. Please go to /singup instead'
    });
}

// Basic routes controller gotten from basic handler
exports.getAllUsers = basic.getAll(User);
//Admin routes for CRUD on users:
exports.getUser = basic.getOne(User);
exports.updateUser = basic.updateOne(User); //Do NOT update password using this function.
exports.deleteUser = basic.deleteOne(User);