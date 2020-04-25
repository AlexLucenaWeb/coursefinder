const Course = require('../models/courseModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getHomePage = (req, res) => {
  res.status(200).render('homepage', {
    title: "Home"
  });
}

exports.getCourses = catchAsync(async(req, res, next) => {
  const courses = await Course.find();
  res.status(200).render('courses', {
    title: "Courses",
    courses: courses
  });
});

exports.getCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findOne({ slug: req.params.slug }).populate();

  //catch error
  if (!course) {
    return next(new AppError('There is no course with that name.', 404));
  }

  res.status(200).render('course', {
    title: `${course.name} Tour`,
    course
  });
});

exports.getContact = (req, res) => {
  res.status(200).render('contact', {
    title: "Contact"
  });
};