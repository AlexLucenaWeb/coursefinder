const Course = require('../models/courseModel');
const catchAsync = require('../utils/catchAsync');

exports.getHomePage = (req, res) => {
  res.status(200).render('homepage', {
    title: "Home"
  });
}

exports.getCourses = catchAsync(async(req, res, next) => {
  const courses = await Course.find();

  res.status(200).render('courses', {
    title: "All Courses <3",
    courses: courses
  });
});

exports.getCourse = (req, res) => {
  res.status(200).render('course', {
    title: "Course"
  });
};

exports.getContact = (req, res) => {
  res.status(200).render('contact', {
    title: "Contact"
  });
};