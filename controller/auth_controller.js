const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {authenticateToken,JWT_SECRET}=require('../common/middleware/auth');
const db=require('../config/edu_db_config');
const {edu_pulse_login_query}=require('../queries/login/edu_pulse_login')
const {edu_pulse_activity_log_query}=require('../queries/activity_log/edu_pulse_activity_log')


exports.edu_pulse_login= async (req,res)=>{
      try{
        const {role,email,password}=req.body;
        const [rows]=await db.execute(edu_pulse_login_query.USER_LOGIN,[role,email]);

        if(rows.length===0){
            return res.status(401).json({"message":"Invalid Credentials"})
        }
        const user=rows[0];
        console.log(rows)
        if(user.status!=='active'){
            return res.status(403).json({"message":"Account is deactivated. Please contact administrator."})
        }
        const isMatch=await bcrypt.compare(password,user.password_hash);
        if(!isMatch){
            return res.status(401).json({"message":"Invalid email,mobile and password."})
        }
        const tokenPayload={
            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role,
            // mobile:user.mobile_number,
            
        }
        const token=jwt.sign(tokenPayload,JWT_SECRET,{expiresIn:'10m'});
        res.json({
            success:true,
            token,
            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                password_hash:user.password_hash,
                role:user.role,
                status:user.status,
                avatar:user.avatar,
                createdAt:user.created_at,
                phone:user.phone,
                lastLogin:user.last_login

            }
        })

    }catch(error){
        console.log("Error in /edu-pulse/api/v1/auth/edu_pulse_login",error);
        res.status(500).json({"message":"Failed to create edu pulse user account."})
    }
}
exports.edu_pulse_register_user = async (req, res) => {
    let conn;
    try {
        const { name, email, phone, password,role } = req.body;
        const cleanEmail = email.trim().toLowerCase();
        conn = await db.getConnection();
        await conn.beginTransaction();
        const [existingUsers] = await conn.execute(edu_pulse_login_query.USER_EXIST,[cleanEmail, phone]);
        if (existingUsers.length > 0) {
            await conn.rollback();
            return res.status(409).json({
                success: false,
                message:
                    "An account with this email address or mobile number already exists."
            });
        }
        const prefix =role.toLowerCase() === "admin"? "ADM-EXEC": "DIR-EXEC";
        const [rows] = await conn.execute(edu_pulse_login_query.NEXT_USER_ID,[`${prefix}-%`]);
        const nextNumber = (rows[0]?.LASTID || 0) + 1;
        const directorId = `${prefix}-${String(nextNumber).padStart(3, "0")}`;
        const passwordHash = await bcrypt.hash(password, 10);
        await conn.execute(edu_pulse_login_query.USER_REGISTER,[directorId,cleanEmail,passwordHash,name.trim(),role,process.env.DEFAULT_AVATAR_URL,phone]);
        await conn.execute(edu_pulse_activity_log_query.insert_activity_log,[`LOG-${Date.now()}`,directorId,name.trim(),role,`${role.toUpperCase()}_ACCOUNT_REGISTERED`,req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",JSON.stringify({directorId,name:name.trim(),email:cleanEmail})]);
        await conn.commit();
        return res.status(201).json({
            success: true,
            message: `${role.toUpperCase()} registered successfully.`,
            data: {
                directorId,
                name: name.trim(),
                email: cleanEmail,
                role: role.toUpperCase()
            }
        });
    } catch (error) {
        if (conn) {
            await conn.rollback();
        }
        console.error(`Registration Error:`, error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error:
                process.env.NODE_ENV === "dev"
                    ? error.message
                    : undefined
        });
    } finally {
        if (conn) {
            conn.release();
        }

    }
};

