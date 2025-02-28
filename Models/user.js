import mongoose from 'mongoose';

const userSchema=new mongoose.Schema({
    name:{
        type:String, 
        required:true
    },
    email:{
        type:String, 
        required:true, 
        unique:true, 
        match:/.+\@.+\..+/
    },
    password:{
        type:String, 
        required:true
    },
    otp:{type:Number},
    otpExpiry:{type:Date}
}, {timistamps:true});

const userModel=mongoose.model('User',userSchema);

export default userModel;