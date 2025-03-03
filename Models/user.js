import mongoose from 'mongoose';

//create a schema for user
const userSchema=new mongoose.Schema({
    googleId:{
        type:String,
        required:true,
        unique:true,
    },
    photo:{
        type:String

    },
    name:{
        type:String, 
        required:true,
        unique:true
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
}, {timestamps:true});

//creating a model

const userModel=mongoose.model('User',userSchema);

export default userModel;