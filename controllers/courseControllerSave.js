const Course = require('./../models/courseModel');

// Top course route controller:
exports.topCourses = (req, res, next) =>{
    req.query.limit = '5';
    req.query.sort = '-ratingAverage';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
};

exports.getAllCourses = async (req, res) =>{
    try {
        console.log(req.query)
        //Query:  CHECK DIFFERENTWAY TO CODE IT. video 94

        //Building the Query:
        //1- Filtering
        const queryObj = {...req.query};
        const excludeFields =['page','sort','limit','fields'];
        excludeFields.forEach(el => delete queryObj[el]);

        //advance filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Course.find(JSON.parse(queryStr));

        // 2- Sorting:
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' '); //swap , with space to make the query in mongoDB
            query = query.sort(sortBy);
        } else{
            query = query.sort('-createdAt');
        };

        // 3- Field limiting:
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // 4- Pagination
        const page = req.query.page * 1 || 1; //we use or to define de default value 
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if(req.query.page){
            const courseNum = await Course.countDocuments();
            if(skip >= courseNum) throw new Error('This page does not exist.');
        };

        //Execute query:
        const courses = await query;
        
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