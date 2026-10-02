const jwt = require('jsonwebtoken');
const JWT_SECRET=process.env.JWT_SECRET
function authenticateToken(req,res,next) {
    const authHeader=req.headers['authorization'];
    const token=authHeader && authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({"message":"Authentication required. Authorization Token Messing."})
    }
    jwt.verify(token,JWT_SECRET,(err,user)=>{
        if(err){
            return res.status(403).json({"message":"Invalid or expired authentication token."})
        }
        req.user=user;
        next();
    });
}

function requireAdmin(req,res,next){
    if(req.user && req.user.role==='Admin'){
        next();
    }else{
        res.status(403).json({"message":"Forbidden. Admin privilege required."})
    }
}

module.exports={authenticateToken,requireAdmin,JWT_SECRET};