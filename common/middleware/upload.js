const multer = require("multer");
const path = require("path");

const uploadPaths = {
    studentPhotoFile: "./upload/students/photo",
    birthCertificateFile: "./upload/students/birthCert",
    transferCertificateFile: "./upload/students/transferCert",
    previousMarksheetFile: "./upload/students/preMarkSheet",
    fatherAadharFile: "./upload/students/fatherAadhar",
    motherAadharFile: "./upload/students/motherAadhar",
    admissionFormFile: "./upload/students/admissionForm"
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPaths[file.fieldname]);
    },
    filename: (req, file, cb) => {
        cb(
            null,
            `${Date.now()}${path.extname(file.originalname)}`
        );
    }
});

module.exports = multer({ storage });