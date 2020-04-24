const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

//Using merparams to get acces from review router to courseId.
const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.protect, 
        authController.restrictTo('user'), 
        reviewController.createReview
        );

// router
//     .route('/:id')
//     .get(reviewController.getReview);
router.route('/:id').delete(reviewController.deleteReview);

module.exports = router;