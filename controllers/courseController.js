const Course = require('./../models/courseModel');
const APIFeatures = require('./../utils/apiFeatures');

// Top course route controller:
exports.topCourses = (req, res, next) =>{
    req.query.limit = '5';
    req.query.sort = '-ratingAverage';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
};

// Basic routes controller:
exports.getAllCourses = async (req, res) =>{
    try {
        //Execute query:
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
    } catch (err) {
        res.status(404).json({
            status : 'fail',
            message : 'erroooor ', err
        });
    };   
};
exports.getCourse = async (req, res) => {
    try { 
        const course = await Course.findById(req.params.id);

        res.status(200).json({
            status : 'success',
            data : { 
                course
            }
        });

    } catch (err) {
        res.status(404).json({
            status : 'fail',
            message : err
        });
    }
    
};
exports.createCourse = async (req, res) => {
    try {
        const newCourse = await Course.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                course: newCourse
            }
        }); 
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent!', err
        })
    }
   
};
exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
    
        res.status(200).json({
            status : 'success',
            data : {
                course
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Invalid data sent!'
        })

    }

};
exports.deleteCourse = async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
    
        res.status(204).json({
            status : 'success',
            data : null
        });

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Invalid data sent!'
        })
    }
};

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