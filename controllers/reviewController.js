const Review = require('./../models/reviewModel');
const basic = require('./basicHandler');

//Midleware to set de User and Course ID
exports.setIds = (req, res, next) =>{
    // If !user and course in body ->  Request course id from param and user id from current user
    if(!req.body.course) req.body.course = req.params.courseId;
    if(!req.body.user) req.body.user = req.user.id;
    next();
}

// Basic routes controller gotten from basic handler
exports.getAllReviews = basic.getAll(Review);
exports.getReview = basic.getOne(Review);
exports.createReview = basic.createOne(Review);
exports.updateReview = basic.updateOne(Review);
exports.deleteReview = basic.deleteOne(Review);