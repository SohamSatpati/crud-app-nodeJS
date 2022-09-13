const express = require('express');
const router = express.Router();

//student controller
const StuedentController = require('../controllers/studentController');

router.get('/', StuedentController.index);
router.get('/list', StuedentController.list);
router.get('/about', StuedentController.about);
router.get('/contact', StuedentController.contact);
router.get('/registration', StuedentController.registration);
router.post('/addStudent', StuedentController.addStudent);
router.get('/deleteStudent/:id', StuedentController.deleteStudent);
router.get('/getStudent/:id/:type', StuedentController.getStudent);
router.post('/getCourse', StuedentController.getCourse);
router.post('/getEmail', StuedentController.checkEmailAlreadyExists);
router.post('/updateStudent', StuedentController.updateStudent);

module.exports = router;
