const mongoose= require('mongoose');
const validator = require('validator');

const reviewSchema = new mongoose.Schema(
        {
        review : {
            type : String,
            required : [true, 'Please writte a review.'],
            maxlength: [340, 'The review is too long.'],
            minlength: [25, 'The review is too short.']
        },
        rating : {
            type : Number,
            required : [true, 'Please give a rating to the course.'],
            min: [0.9, 'Rating must be above 1'],
            max: [5.1, 'Rating must be below 5']
        },
        createdAt:{
            type: Date,
            default: Date.now(),
        },
        course: {
            type: mongoose.Schema.ObjectId,
            ref: 'Course',
            required: [true, 'Review must belong to Course.']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must have an Author.']
        }
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    }
);

//Populate the User:
reviewSchema.pre(/^find/, function(next){
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

//Each user can review each course only one time.
reviewSchema.index({course: 1, user: 1}, {unique: true});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;