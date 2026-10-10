const jwt=require("jsonwebtoken");
const User=require("../models/user");

const authUser=async (req,res,next)=>{
try{
    const {token}=req.cookies;
    if(!token)
    {
        throw new Error("Please do login");
    }
    const decodeObj=await jwt.verify(token,"Vedavyas@2006");
    const {_id}=decodeObj;
    const user=await User.findById(_id);
    req.user=user;
    if(!user)
    {
        throw new Error("User not found");
    }
    next();
}
catch(err)
{
    res.status(400).send("Error "+err.message);
}
};

module.exports=authUser;
