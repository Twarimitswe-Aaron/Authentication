import cryptoRandomString from 'crypto-random-string';
import userModel from '../Models/user.js'; 
import sendOTP from '../utils/mailers.js';  
import JWT from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import passport from 'passport';


//temporary store for email related information

const otpStore=new Map();

//generate otp which must be sent to the email

const generateOTP = async (req, res) => {
    try {
        const {name, email, password } = req.body;
        let existUser = await userModel.findOne({ $or: [{ email }, { name }] });
        if (existUser) {
            console.log(existUser);
            return res.status(400).json({ message: "User already exists" });
        }
        const otp = cryptoRandomString({ length: 6, type: 'numeric' });
        const otpExpiry = Date.now() + 5 * 60 * 1000;  // 5 minutes expiry
        
       otpStore.set(email, {name,email,password,otp, otpExpiry });
        
        await sendOTP(email, otp);

        res.status(200).json({ message: `OTP sent to ${email}` });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

//verify if the otp is correct during account creation

const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpData=otpStore.get(email);
        const {name, password } = otpData;

        if(!otpData){
            return res.status(400).json({message:"OTP not found or expired"})
        }
        if ( otp !== otp || Date.now() > otpData.otpExpiry) {
            
            return res.status(400).json({ message: "Invalid OTP" });
            
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const user=new userModel({name,email,password:hashedPassword});
        await user.save();

        otpStore.delete(email);

       return res.status(200).json({ message: "OTP verified successfully" });
       

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

//signin port

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT secret is not defined in environment variable");
            return res.status(500).send('Internal server error');
        }

        const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        //add cookie 
        res.cookie("auth_cookie",token,{
            httpOnly:true,
            secure:true,
            sameSite:'strict'
        })




        res.status(200).json({ message: "User logged in successfully", token });



    } catch (err) {
        console.log("Error during signin:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}


//create a temporary variable to hold email related information
const resetStore=new Map();

//create a reset which makes the first otp
const resetPass=async (req,res)=>{
    try{
        const {name,email,password,rePassword}=req.body;
        if(password!==rePassword){
            return res.status(400).json({message:"Passwords do not match"});
        }
        const user=await userModel.findOne({email,name});
        if(!user){
            return res.status(400).json({message:"User does not exist, please create an account"});
        }
        
        const otp=cryptoRandomString({length:6,type:'numeric'});
        const otpExpiry=Date.now()+5*60*1000;
        resetStore.set(email,{email,password,rePassword,otp,otpExpiry});
        await sendOTP(email,otp);
        res.status(200).json({message:`OTP sent to ${email}`});
    }catch(err){
        res.status(500).json({message:err.message});
    }
}
const verifyReset=async (req,res)=>{
    try{
        const {email,otp}=req.body;
  
        const resetData=resetStore.get(email);
        const {password,rePassword,otpExpiry}=resetData;
       
        if(password!==rePassword){
            return res.status(400).json({message:"Passwords do not match"});
        }
       
        if(!resetData || otp!==resetData.otp || Date.now()>otpExpiry){
            return res.status(400).json({message:"Invalid OTP"});
        }
        const user=await userModel.findOne({email});
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        user.password=hashedPassword;
        resetStore.delete(email);
        res.status(200).json({message:"OTP verified successfully"});


    }catch(err){
        res.status(500).json({message:err.message});
}
}

//creating google based login
const googleLogin=passport.authenticate("google",{scope:["profile","email"]});

//google callback after authentication
const googleCallback=(req,res,next)=>{
    passport.authenticate("google", (err,user,info)=>{
        if(err)return next(err);
        if(!user)return res.redirect(`http://localhost:${process.env.PORT}/login`);

        req.logIn(user,(err)=>{
            if(err) return next(err);
            res.redirect(`http://localhost:${process.env.PORT}/dashboard`);
        });
    })(req,res,next);
}

//redirect after successful login
const successRedirect=(req,res)=>{
    res.redirect(`http://localhost:${process.env.PORT}/dashboard`);
}

const logout=(req,res,next)=>{
req.logout((err)=>{
    if(err) return next(err);
    res.redirect(`http://localhost:${process.env.PORT}`)
});
}


export default {signin, 
    generateOTP, 
    resetPass, 
    verifyReset,
    verifyEmail,
    googleLogin,
    googleCallback,
    successRedirect,
    logout
};
