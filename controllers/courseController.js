const Course = require('./../models/courseModel');
const basic = require('./basicHandler');

// Top course route controller:
exports.topCourses = (req, res, next) =>{
    req.query.limit = '5';
    req.query.sort = '-ratingAverage';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
};

// Basic routes controller gotten from basic handler
exports.getAllCourses = basic.getAll(Course);
exports.getCourse = basic.getOne(Course, {path:'reviews'});
exports.createCourse = basic.createOne(Course);
exports.updateCourse = basic.updateOne(Course);
exports.deleteCourse = basic.deleteOne(Course);
