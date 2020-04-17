const Course = require('./../models/courseModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// Top course route controller:
exports.topCourses = (req, res, next) =>{
    req.query.limit = '5';
    req.query.sort = '-ratingAverage';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
};

// Basic routes controller:
// Errors catch by catchAsync, error handler and  error class
exports.getAllCourses = catchAsync(async (req, res, next) =>{
        //Execute query:
        //Calling filters from apiFeatures:
        const features = new APIFeatures(Course.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const courses = await features.query;
        
        //Send response:
        res.status(200).json({
            status : 'success',
            result : courses.length,
            data : { 
                courses
            }
        });   
});
exports.getCourse = catchAsync(async (req, res, next) => {
        const course = await Course.findById(req.params.id).populate('reviews');

        if (!course) {
            return next(new AppError('No tour found with that ID', 404));
        }
        
        res.status(200).json({
            status : 'success',
            data : { 
                course
            }
        });
});
exports.createCourse = catchAsync(async (req, res, next) => {
            const newCourse = await Course.create(req.body);
    
            res.status(201).json({
                status: 'success',
                data: {
                    course: newCourse
                }
            });
});
exports.updateCourse = catchAsync(async (req, res, next) => {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!course) {
            return next(new AppError('No tour found with that ID', 404));
        }
    
        res.status(200).json({
            status : 'success',
            data : {
                course
            }
        });
});
exports.deleteCourse = catchAsync(async (req, res, next) => {
        const course = await Course.findByIdAndDelete(req.params.id);

        if (!course) {
            return next(new AppError('No tour found with that ID', 404));
        }

        res.status(204).json({
            status : 'success',
            data : null
        });
});

// exports.getCourseStats = async (req, res) => {
//     try {
//         const stats = await Course.aggregate([
//            {
//                $match: {ratingAverage: {$gte: 4.5}}
//            },
//            {
//                group : {
//                    _id: null,
//                    avgRating: { $avg: '$ratingAverage'},
//                    avgPrice: { $avg: '$price'},
//                    minPrice: { $min: '$price'},
//                    maxPrice: { $max: '$price'}
//                }
//            }
//         ]);

//         res.status(200).json({
//             status : 'success',
//             data : {
//                 stats
//             }
//         });

//     }catch (err) {
//         res.status(404).json({
//             status: 'fail',
//             message: 'Invalid data sent!', err
//         })
//     }

// }