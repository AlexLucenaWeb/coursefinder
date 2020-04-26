const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController')

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewsController.getHomePage);
router.get('/courses', viewsController.getCourses);
router.get('/courses/:slug', viewsController.getCourse);
router.get('/contact', viewsController.getContact);
router.get('/login', viewsController.getLogin);

module.exports = router;