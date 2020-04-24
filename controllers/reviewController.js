const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const basic = require('./basicHandler');

//Basic review controller
exports.getAllReviews =catchAsync(async (req, res, next) => {
    let courseFilter = {};
    if(req.params.courseId) courseFilter = {course: req.params.courseId};


    const reviews = await Review.find(courseFilter);

    res.status(200).json({
        status: 'success',
        result: reviews.length,
        data: {
            reviews
        }
    });
});
exports.getReview = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(new AppError('No review found with that ID', 404));
    }

    res.status(200).json({
        status : 'success',
        data : { 
            review
        }
    });
});

//Midleware to set de User and Course ID
exports.setIds = (req, res, next) =>{
    // If !user and course in body ->  Request course id from param and user id from current user
    if(!req.body.course) req.body.course = req.params.courseId;
    if(!req.body.user) req.body.user = req.user.id;
    next();
}

exports.createReview = basic.createOne(Review);
exports.updateReview = basic.updateOne(Review);
exports.deleteReview = basic.deleteOne(Review);

// exports.createReview = catchAsync(async (req, res, next) => {
//     // If !user and course in body ->  Request course id from param and user id from current user
//     if(!req.body.course) req.body.course = req.params.courseId;
//     if(!req.body.user) req.body.user = req.user.id;

//     const newReview = await Review.create(req.body);

//     res.status(201).json({
//         status: 'success',
//         data: {
//             review: newReview
//         }
//     });
// });