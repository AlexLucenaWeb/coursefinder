const express = require('express');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router.get('/', viewsController.getHomePage);
router.get('/courses', viewsController.getCourses);
router.get('/courses/:slug', viewsController.getCourse);
router.get('/contact', viewsController.getContact);

module.exports = router;
