const MechanicModel=require("../Models/MechanicModel")
const {sentOtp,verifyOtp} =require("../Middleware/twilio")
const jwt =require('jsonwebtoken')
const bcrypt = require("bcrypt")
const maxAge=3*24*60*60;
const createToken= (id)=>{
  return jwt.sign({id},"secretdata",{expiresIn:maxAge})
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

let mechanicData
//Mechanic Register using OTP
module.exports.mechanicregister=async(req,res,next)=>{
        
    try{
        
        let { name, email, phone, password} = req.body;
        console.log("mechanic entered")
        mechanicData={name:name,email:email,phone:phone,password:password} 
        console.log(mechanicData,"hiiiiii")
        const mechanic=await MechanicModel.findOne({email})
        const phoneno=await MechanicModel.findOne({phone})
        if(mechanic||phoneno)
        {
            res.status(401).json({status:"failed",message :"Data already exists Login now"})
        }
        else
        {
            console.log("hii sent otp")
            let data = await sentOtp(phone);
            console.log(data);
                
                
            res.status(201).json({status:"success",message:"otp sending successful"})
         }
    }catch(error){
        res.status(401).json({status:"failed",message:error.message})
    }
    console.log("end")
};
module.exports.verifyOtp=async(req,res,next)=>{
    try{    
        console.log("verify otp entered")

    const {otp} = req.body;
    console.log(otp)
    let { name, email, phone, password} = mechanicData;
    console.log(mechanicData,"wesrdtfyghjkm")
    let mechDetails = await verifyOtp(otp, phone);
    console.log(mechDetails,"mchanic details printed");
    if(mechDetails.status ==='approved') {
        let hashpassword = await bcrypt.hash(password, 10);
        let mechanicdetails = await MechanicModel.create({
        name,
        email,
        phone,
        password: hashpassword,
        
      });
      console.log(mechanicdetails)
      res.status(200).json({
        success: true,
        mechanicdetails,
        message: "succesfully created new Mechanic",
      });
    }else {
      res.json({ success: false, message: "incorrect OTP" });
    }
  
    }catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports.mechanicLogin=async(req,res,next)=>{
  try{
      const {email,password}=req.body
      console.log(email,password)
      const mechanic=await MechanicModel.findOne({email})
      console.log("mechanic",mechanic)
      if(mechanic)
      {
          const validpassword=await bcrypt.compare(password,mechanic.password)
          if(validpassword)
          {
              const token =createToken(mechanic._id);
              console.log(token,"token");
              res
              .status(200)
              .json({ message: "Login Successfull", mechanic, token, success: true });

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


    