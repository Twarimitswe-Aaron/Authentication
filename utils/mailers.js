import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config();

const sendOTP= async (email, otp)=>{
    console.log("sendOTP is called"); 
    try{
        const transporter = nodemailer.createTransport({
            host: 'in-v3.mailjet.com', // Mailjet SMTP host
            port: 587, // TLS port
            secure: false, // Use TLS
            auth: {
                user: process.env.MJ_APIKEY_PUBLIC,  // Public API Key from Mailjet
                pass: process.env.MJ_APIKEY_PRIVATE, // Private API Key from Mailjet
            },
        });

        console.log("Transporter is created")

        const mailOptions={
            from:process.env.EMAIL_USER,
            to:email,
            subject:'OTP for authentication',
            text:`Your OPT code is ${otp}. It is valid for 5 minutes`
        }
        

        try {
            console.log("Sending email with options:", mailOptions);
            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully!");
        } catch (err) {
            console.error("Error sending email:", err);
        }
    }catch(err){
       return {success:false, message:err.message};
    }
}


export default sendOTP;
