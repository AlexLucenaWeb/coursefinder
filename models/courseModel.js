const mongoose= require('mongoose');
const slugify= require('slugify');
const validator = require('validator');

//Schema -- test
const courseSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'A course must have a name'],
        unique: [true, 'A course must have a unique name'],
        trim: true,
        maxlength: [40, 'The course name is too long'],
        minlength: [5, 'The course name is too short']
        // validate: [validator.isAlpha, 'The nane should containt only letters']
    },
    slug: String,
    duration:{
        type: Number,
        required: [true, 'A course must have a duration'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A course must have a grup size']
    },
    difficulty: {
        type: String, 
        required: [true, 'A course must have a difficulty'],
        enum:{
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty must be either easy, medium or difficult'
        } 
    },
    ratingAverage: {
        type: Number,
        default: 4.5, 
        min: [1, 'Rating must be above 1'],
        max: [5, 'Rating must be below 5']
    },
    ratingQuantity: {
        type: Number,
        default:0
    },
    price: {
        type: Number,
        required: [true, 'A course must have a price']
    },
    priceDiscount:{
        type: Number,
        validate: {
            validator: function(val){
                // this only points to current doc on NEW docs.
                return val < this.price;
            },
            message: "The discount price ({VALUE}) should be lower than the price."
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A course must have a summary']
    },
    description:{
        type: String,
        trim: true
    },
    imageCover:{
        type: String,
        required: [true, 'A course must have a a cover image']
    },
    images: [String],
    createdAt:{
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    vipCourse: {
        type: Boolean,
        default: false
    }
}, 
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
}
);

//Virtual properties: 
courseSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7;
});

//MONGOOSE MIDDLEWARE:
//DOCUMENT MIDDWR. Create Slug: (only for .save() and .create() (Not for update))
courseSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true});
    next();
});

// QUERY MIDDLWR:
courseSchema.pre(/^find/, function(next){
    this.find({vipCourse: {$ne: true} });
    next();
});

// courseSchema.post(/^find/, function(docs, next){
//     console.log(docs);
//     next();
// });

// // AGRETATION MIDDLWR
// courseSchema.pre('aggregate', function(next){
//     console.log(this);
//     next();
// });




const Course = mongoose.model('Course', courseSchema);

module.exports = Course;