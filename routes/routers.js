var express = require('express');

// var portfolioRouter = require('./v1.portfolioRoute');
var student_routes = require('./student_routes');
// var mandateRouter = require('./v1.physicalMandate');
// var wealthmaker = require('./v1WealthmakerRoute');
let auth_routes=require('../routes/auth_routes')
const router = express.Router();

// router.use('/upload', portfolioRouter);
router.use('/student', student_routes);
// router.use('/mandate',mandateRouter);
// router.use('/wealthmaker', wealthmaker);
router.use('/auth',auth_routes);

module.exports = router;
