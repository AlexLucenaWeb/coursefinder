const mongoose= require('mongoose');
const slugify= require('slugify');
const validator = require('validator');

//Schema -- test

const courseSchema = new mongoose.Schema(
    {
        name : {
            type: String,
            required: [true, 'A course must have a name'],
            unique: [true, 'A course must have a unique name'],
            trim: true,
            maxlength: [100, 'The course name is too long'],
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
            max: [5, 'Rating must be below 5'],
            set: value => Math.round(value * 10 ) / 10
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
        },
        academy: {
            type : Object,
            name: {
                type: String,
                required: [true, 'An academy must have a name'],
                unique: [true, 'A course must have a unique name'],
                trim: true,
                maxlength: [40, 'The course name is too long'],
                minlength: [5, 'The course name is too short']
            }, 
            location: {
                //GeoJSON:
                type: {
                    type: String,
                    default: 'Point',
                    enum:['point']
                },
                coordinates:[Number]
            },
            address: String,
            description: String
        },
        type: {
            type: String, 
            required: [true, 'A course must have a type'],
            enum:{
                values: ['art', 'design', 'language', 'technology', 'sport'],
                message: 'Type must be: art, design, language, technology, sport'
            }
        },
        Scheduling: {
            type: [String],
            required: [true, 'A course must have a Scheduling']
        },
        requirements: String
    }, 
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    }
);


//Adding indexes to make faster searchs
courseSchema.index({price: 1, ratingAverage: -1 });
courseSchema.index({slug: 1});
courseSchema.index({type: 1});


//Virtual properties: 
courseSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7;
});

// //virtual populate (reviews):
courseSchema.virtual('reviews', {
    ref: 'Review', 
    foreignField:'course', //The course field in the review model
    localField: '_id' //The course in this model that is the same that the foreingfield 
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