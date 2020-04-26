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
  const course = await Course.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  //catch error
  if (!course) {
    return next(new AppError('There is no course with such a name.', 404));
  }

  res.status(200).render('course', {
    title: `${course.name}`,
    course
  });
});

exports.getContact = (req, res, next) => {
  res.status(200).render('contact', {
    title: "Contact"
  });
};

exports.getLogin = (req, res, next) => {
  res.status(200).render('login', {
    title: "Login"
  });
};