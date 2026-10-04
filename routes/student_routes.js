var express = require('express');
var router = express.Router();

var student_controller = require('../controller/student_controller');
const upload = require("../common/middleware/upload");

router.post(
    "/edu_pulse_student_register",
    upload.fields([
        { name: "studentPhotoFile", maxCount: 1 },
        { name: "birthCertificateFile", maxCount: 1 },
        { name: "transferCertificateFile", maxCount: 1 },
        { name: "previousMarksheetFile", maxCount: 1 },
        { name: "fatherAadharFile", maxCount: 1 },
        { name: "motherAadharFile", maxCount: 1 },
        { name: "admissionFormFile", maxCount: 1 }
    ]),
    student_controller.edu_pulse_student_register
);

module.exports = router;
