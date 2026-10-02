var express = require('express');
var router = express.Router();

var auth_controller = require('../controller/auth_controller');
router.post('/edu_pulse_login', auth_controller.edu_pulse_login);
router.post('/edu_pulse_register_user',auth_controller.edu_pulse_register_user)


module.exports = router;
