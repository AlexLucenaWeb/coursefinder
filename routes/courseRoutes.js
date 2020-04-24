const express = require('express');
const courseController = require('./../controllers/courseController');
const authController = require('./../controllers/authController')
const router = express.Router();
const reviewRouter = require('./../routes/reviewRoutes');

//Use review router with this query
router.use('/:courseId/reviews', reviewRouter);

router
    .route('/top-5-courses')
    .get(courseController.topCourses, courseController.getAllCourses);

router
    .route('/')
    // authController.protect ensures only logged in users will be able to view all courses
    .get(courseController.getAllCourses)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'school'),
        courseController.createCourse,
    );
    
router
    .route('/:id')
    .get(courseController.getCourse)
    .patch(
        courseController.updateCourse,
        authController.restrictTo('admin', 'school'))
    .delete(
        authController.protect,
        authController.restrictTo('admin'), 
        courseController.deleteCourse);

module.exports = router;

