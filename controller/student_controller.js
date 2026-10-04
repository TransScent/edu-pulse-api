const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
// const {authenticateToken,JWT_SECRET}=require('../common/middleware/auth');
const db=require('../config/edu_db_config');
const {edu_pulse_student_query}=require('../queries/students/edu_pulse_query')
// const {edu_pulse_activity_log_query}=require('../queries/activity_log/edu_pulse_activity_log')
require('dotenv').config();

exports.edu_pulse_student_register = async (req, res) => {
    let conn;
    console.log(req.headers["content-type"]);
    try {
        const {
            firstName,
            middleName,
            lastName,
            gender,
            dob,
            srNumber,
            height,
            weight,
            nationality,
            editRemarks,
            address,
            city,
            state,
            pincode,
            phone,
            email,
            schoolName,
            className,
            sectionName,
            rollNo,
            academicYear,
            admittedUnderRte,
            fatherName,
            fatherOccupation,
            fatherPhone,
            motherName,
            motherPhone,
            previousSchool,
            bloodGroup,
            studentPenNumber,
            studentAadharNumber,
            religion,
            category,
            anyDisability,
            transportArea,
            transportAmount,
            status,
            fullName,
            parentName,
            parentPhone,
            contactNumber,
            admissionDate
        } = req.body;

        conn = await db.getConnection();
        await conn.beginTransaction();

        // Get Class Id
        const [classRows] = await conn.execute(
            "SELECT ID FROM CLASSES WHERE NAME = ?",
            [className.toUpperCase()]
        );

        if (!classRows.length) {
            await conn.rollback();
            return res.status(404).json({
                success: false,
                message: "Invalid class."
            });
        }

        const classId = classRows[0].ID;

        // Get Section Id
        const [sectionRows] = await conn.execute(
            "SELECT ID FROM SECTIONS WHERE CLASS_ID = ? AND NAME = ?",
            [classId, sectionName.toUpperCase()]
        );

        const sectionId = sectionRows[0]?.ID || null;

        // Generate Parent Id
        const [parentRows] = await conn.execute(
            edu_pulse_student_query.NEXT_PARENT_ID,
            ["PAR-%"]
        );

        const parentNumber = (parentRows[0]?.LASTID || 0) + 1;

        const parentId = `PAR-${String(parentNumber).padStart(3, "0")}`;
        const parentCode = `PC${String(parentNumber).padStart(5, "0")}`;
       const studentPhotoFile = req.files?.studentPhotoFile?.[0]
            ? `/upload/students/photo/${req.files.studentPhotoFile[0].filename}`
            : null;

        const birthCertificateFile = req.files?.birthCertificateFile?.[0]
            ? `/upload/students/birthCert/${req.files.birthCertificateFile[0].filename}`
            : null;

        const transferCertificateFile = req.files?.transferCertificateFile?.[0]
            ? `/upload/students/transferCert/${req.files.transferCertificateFile[0].filename}`
            : null;

        const previousMarksheetFile = req.files?.previousMarksheetFile?.[0]
            ? `/upload/students/preMarkSheet/${req.files.previousMarksheetFile[0].filename}`
            : null;

        const fatherAadharFile = req.files?.fatherAadharFile?.[0]
            ? `/upload/students/fatherAadhar/${req.files.fatherAadharFile[0].filename}`
            : null;

        const motherAadharFile = req.files?.motherAadharFile?.[0]
            ? `/upload/students/motherAadhar/${req.files.motherAadharFile[0].filename}`
            : null;

        const admissionFormFile = req.files?.admissionFormFile?.[0]
            ? `/upload/students/admissionForm/${req.files.admissionFormFile[0].filename}`
            : null;
        // Insert Parent
        await conn.execute(
            edu_pulse_student_query.INSERT_PARENT,
            [
                parentId,
                parentCode,
                parentName?.trim() || fatherName?.trim(),
                "FATHER",
                fatherOccupation || null,
                email?.toLowerCase() || null,
                parentPhone || fatherPhone,
                address
            ]
        );

        // Generate Student Id
        const [studentRows] = await conn.execute(
            edu_pulse_student_query.NEXT_STUDENT_ID,
            ["STU-%"]
        );

        const nextNumber = (studentRows[0]?.LASTID || 0) + 1;

        const studentId = `STU-${String(nextNumber).padStart(3, "0")}`;

        const admissionYear = academicYear.split("-")[0];

        const admissionNo = `SCH${admissionYear.slice(-2)}-${String(nextNumber).padStart(4, "0")}`;

        // Convert DOB DD-MM-YYYY => YYYY-MM-DD
        const formattedDob = dob
            ? dob.split("-").reverse().join("-")
            : null;
        
        // Insert Student
        await conn.execute(
            edu_pulse_student_query.INSERT_STUDENT,
            [
                studentId,                     // ID
                admissionNo,                   // ADMISSION_NO
                rollNo,                        // ROLL_NO
                firstName,                     // FIRST_NAME
                middleName || null,            // MIDDLE_NAME
                lastName,                      // LAST_NAME
                gender,                        // GENDER
                formattedDob,                  // DOB
                bloodGroup || null,            // BLOOD_GROUP
                address,                       // ADDRESS
                city,                          // CITY
                state,                         // STATE
                pincode,                       // PINCODE
                contactNumber || phone,        // CONTACT_NUMBER
                email || null,                 // EMAIL
                studentPhotoFile || null,      // PHOTO_URL
                studentAadharNumber || null,   // NATIONAL_ID
                srNumber || null,              // SR_NUMBER
                height || null,                // HEIGHT
                weight || null,                // WEIGHT
                nationality || "Indian",       // NATIONALITY
                religion || null,              // RELIGION
                category || null,              // CATEGORY
                studentPenNumber || null,      // STUDENT_PEN_NUMBER
                schoolName || null,            // SCHOOL_NAME
                fatherName || null,            // FATHER_NAME
                fatherOccupation || null,      // FATHER_OCCUPATION
                fatherPhone || null,           // FATHER_PHONE
                motherName || null,            // MOTHER_NAME
                motherPhone || null,           // MOTHER_PHONE
                birthCertificateFile || null,
                transferCertificateFile || null,
                previousMarksheetFile || null,
                fatherAadharFile || null,
                motherAadharFile || null,
                admissionFormFile || null,
                previousSchool || null,
                anyDisability || "NO",
                transportArea || null,
                transportAmount || null,
                admittedUnderRte || "NO",
                editRemarks || null,
                academicYear,
                admissionDate,
                classId,
                sectionId,
                parentId,
                status || "active",
                req.user?.id || null,
                null
            ]
        );

        await conn.commit();

        return res.status(201).json({
            success: true,
            pendingApproval: false,
            message: "Student enrolled successfully",
            student: {
                ...req.body,
                id: studentId,
                admissionNo,
                photoUrl: studentPhotoFile,
                nationalId: studentAadharNumber,
                classId,
                sectionId,
                parentId,
                academicStatus: status,
                approvalStatus: "Approved",
                addedBy: req.user?.name || null,
                addedByRole: req.user?.role || null,
                addedByEmail: req.user?.email || null,
                addedDate: admissionDate,
                academicHistory: []
            }
        });

    } catch (error) {

        if (conn) {
            try {
                await conn.rollback();
            } catch (rollbackError) {
                console.error("Rollback Error:", rollbackError);
            }
        }

        console.error("Student Registration Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: process.env.NODE_ENV === "dev"
                ? error.message
                : undefined
        });

    } finally {
        if (conn) {
            conn.release();
        }
    }
};