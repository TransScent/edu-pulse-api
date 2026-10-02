var express = require('express');
var router = express.Router();

var student_controller = require('../controller/student_controller');

// router.post('/automated', student_controller.test);
router.get('/test', student_controller.test);

module.exports = router;
