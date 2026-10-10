const { JsonWebTokenError } = require("jsonwebtoken");
const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"firstName is required"],
        trim:true,
        minLength:[2,"FirstName should exceed 2characters"],
        maxLength:[50,"FirstName cant exceed 50characters"],

    },
    lastName:{
        type:String,
         maxLength:[50,"LastName cant exceed 50characters"],
    },
    age:{
        type:Number,
        required:[true,"age is required"],
        min:[18,"You must be 18years old"],
        max:[120,"Max age exceeded"],
    },
    gender:{
        type:String,
       
        lowercase:true,
        trime:true,

        validate:(val)=>{
            if(!["male","female","others"].includes(val))
            {
               throw err("Gender not mentioned properly");
            }
        }
    },
    emailId:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        lowercase:true,
        trim:true,
        validate(val){
            if(!validator.isEmail(val))
            {
                throw new Error("Incorrect Email " + val);
            }
        }
    },
    password:{
        type:String,
        required:[true,"passWord is required"],
        minLength:[8,"password should exceed 8 characters"],
        // unique:true,
         validate(val){
            if(!validator.isStrongPassword(val))
            {
                throw new Error("Please enter a strong Password" + val);
            }
        }
    },
    phoneNum:{
        type:String,
        required:true,
        unique:true,
        validate :(val)=>{
            if(val.toString().length===10)
            {
               return true;
            }
            return false;
        }

    },
},{
    timestamps:true,
  
});
//method for getting token
userSchema.methods.getJWT=async function(){
    const user=this;

    const token=await jwt.sign({_id:user._id},"Vedavyas@2006",{expiresIn:"1d"});
    return token;

}
//method for validatingpassword
userSchema.methods.validatePassword=async function(userInputPassword){
    const user=this;
   const  hashedPassword=user.password;
    const isCorrect=await bcrypt.compare(userInputPassword,hashedPassword);
    return isCorrect;
}
//hashing the pass
// Add this right before your userSchema.methods definitions
// userSchema.pre("save", async function (next) {
//   const user = this;

//   // Only hash the password if it has been modified (or is new)
//   if (!user.isModified("password")) {
//     return next();
//   }

//   try {
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(user.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });


const User=mongoose.model("User",userSchema);
module.exports=User;