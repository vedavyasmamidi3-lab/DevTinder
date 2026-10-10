const validate = require("validator");

const validateSignUp = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Enter the first and last name correctly");
  } else if (!validate.isEmail(emailId)) {
    throw new Error("Enter correct emailID");
  } else if (!validate.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

const validateEditProfileData=(req)=>{
  const allowedEditFields=["firstName","lastName","emailId","photoUrl","gender","age","about","skills"];
  const isEditAllowed=Object.keys(req.body).every((field)=>allowedEditFields.includes(field));
  return isEditAllowed;
}

//export
module.exports={
  validateSignUp,
  validateEditProfileData,
}