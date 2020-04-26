const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController')

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getHomePage);
router.get('/courses', authController.isLoggedIn, viewsController.getCourses);
router.get('/courses/:slug', authController.isLoggedIn, viewsController.getCourse);
router.get('/contact', authController.isLoggedIn, viewsController.getContact);
router.get('/login', authController.isLoggedIn, viewsController.getLogin);
router.get('/user', authController.protect, viewsController.getUser);

router.post('/submit-user', authController.protect, viewsController.updateUser);

module.exports = router;