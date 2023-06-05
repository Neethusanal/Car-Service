const UserModel=require("../Models/UserModel")
const jwt =require('jsonwebtoken')
const bcrypt = require("bcrypt")
const maxAge=3*24*60*60;
const nodemailer = require("nodemailer");
const { sendEmailOTP } = require('../Middleware/Nodemailer');
const createToken= (id)=>{
    return jwt.sign({id},"secret key",{expiresIn:maxAge})
}
const handleError=(err)=>{
    let errors={email:"",password:""}
    if(err.code===11000)
    {
        errors.email="email is already registered";
        return errors;
    }
    if(err.message.includes("user validation failed"))
    {
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path]=properties.message;
        })
    }
    return errors;
}


let userData
let emailOtp
module.exports.userSignup=async(req,res,next)=>{
   console.log(req.body);
    try{
        let {name,email,mobile,password}=req.body
        console.log(req.body)
        const user=await UserModel.findOne({email});
        console.log(user,"user")
        if(!user)
        {userData={
            name,email,password,mobile
        }
        const otpEmail = Math.floor(1000 + Math.random() * 9000);
        console.log(otpEmail, "4");
        emailOtp = otpEmail;

        sendEmailOTP(email, otpEmail)
        .then((info) => {
          console.log(`Message sent: ${info.messageId}`);
          console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        })
        .catch((error) => {
          throw error;
        });
      res.status(200).json({
        message: "OTP is send to given email ",
        otpSend: true,
      });

    }
    else {
        res.status(200).json({
          message: "Already user exist with this email",
          otpSend: false,
        });
      }
    } catch (error) {
      console.log(error);
      const errors = handleError(error);
      res.status(400).json({ errors, otpSend: false });
    }
  };
  module.exports.verifyOtp=async(req,res,next)=>{
   
    try {
        let { otp } = req.body;
        console.log(otp,"otp recieved")
        console.log(userData)
        let { name, email, password, mobile} = userData;
        console.log(name)
        if (otp == emailOtp) {
            console.log("here verify",userData)
          let hashpassword = await bcrypt.hash(password, 10);
    
          let userdetails = await UserModel.create({
            name,
            email,
            mobile,
            password: hashpassword,
           
          });
          res
            .status(200)
            .json({ success: true, message: "Successfully registered", userdetails, created: true });
        } else {
          res.status(400).json({
            success:false,
            message: "Entered OTP from email is incorrect",
            created: false,
          });
        }
      } catch(err){
 
        console.log(err)
         res.status(400).json({    success:false,
          message: "Entered OTP from email is incorrect",
          created: false,});
      }
    };
    module.exports.loginUser=async(req,res,next)=>{
        try{
            const {email,password}=req.body
            console.log(email,password)
            const user=await UserModel.findOne({email})
            console.log("user",user)
            if(user)
            {
                const validpassword=await bcrypt.compare(password,user.password)
                if(validpassword)
                {
                    const token = createToken(user._id);
                    console.log(token,"token");
                    res
                    .status(200)
                    .json({ message: "Login Successfull", user, token, success: true });
 
                }
                else{
                    const errors = { message: "incorrect password" };
                    res.json({ errors, success: false });
                }
            }else{
                const errors = { message: "email does not exist" };
                res.json({ errors, success: false });
            }

        }catch(error){
        console.log(error);
        const errors = { message: "Incorrect admin email or password" };
        res.json({ errors, success: false });
        
    }

   
    }
   
