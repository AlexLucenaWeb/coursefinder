const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

// Errors catch by catchAsync, error handler and  error class
//creating general basic handler function for all controllers
exports.deleteOne = Model =>  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
        status : 'success',
        data : null
    });
});
exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!document) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status : 'success',
        data : {
            data: document
        }
    });
});
exports.createOne =  Model => catchAsync(async (req, res, next) => {
    const newDocument = await Model.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            data : newDocument
        }
    });
});
//giving populate options in case of populate funciton in the query:
exports.getOne = (Model, popOptions) =>  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if(popOptions) query = query.populate(popOptions);
    const document = await query;

    if (!document) {
        return next(new AppError('No course with that ID', 404));
    }

    res.status(200).json({
        status : 'success',
        data : {
            data: document
        }
    });
});

exports.getAll = Model => catchAsync(async (req, res, next) =>{
    //Only for reviews:
    let courseFilter = {};
    if(req.params.courseId) courseFilter = {course: req.params.courseId};

    //Execute query:
    //Calling filters from apiFeatures:
    const features = new APIFeatures(Model.find(courseFilter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const document = await features.query;

    //Send response:
    res.status(200).json({
        status : 'success',
        result : document.length,
        data : {
            data : document
        }
    });
});;