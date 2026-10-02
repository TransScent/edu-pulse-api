const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Teachers = sequelize.define("Teachers", {

  role: DataTypes.STRING,
  email: DataTypes.STRING,
  mobile_number: DataTypes.STRING,
  firstName: DataTypes.STRING,
  middleName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  gender: DataTypes.STRING,
  dob: DataTypes.DATEONLY,
  bloodGroup: DataTypes.STRING,
  qualification: DataTypes.STRING,
  specialization: DataTypes.STRING,
  designation: DataTypes.STRING,
  experienceYears: DataTypes.INTEGER,
  joiningDate: DataTypes.DATEONLY,
  employeeType: DataTypes.STRING,
  subjects: DataTypes.STRING,
  classesTaught: DataTypes.STRING,
  salary: DataTypes.DECIMAL,
  schoolName: DataTypes.STRING,
  department: DataTypes.STRING,
  address: DataTypes.TEXT,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  pincode: DataTypes.STRING,
  phone: DataTypes.STRING,
  alternatePhone: DataTypes.STRING,
  secondaryEmail: DataTypes.STRING,
  emergencyContactName: DataTypes.STRING,
  emergencyContactPhone: DataTypes.STRING,
  bankName: DataTypes.STRING,
  bankAccountNo: DataTypes.STRING,
  ifscCode: DataTypes.STRING,
  panNumber: DataTypes.STRING,
  aadharNumber: DataTypes.STRING,
  photo: DataTypes.STRING,
  resume: DataTypes.STRING,
  qualificationFile: DataTypes.STRING,
  idProof: DataTypes.STRING,
  addressProof: DataTypes.STRING,
  experienceFile: DataTypes.STRING

});

module.exports = Teachers;
