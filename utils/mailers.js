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
            tls:{
                rejectUnauthorized:false,
            },
            debug:true,
            logger:true,
        });

        console.log("Transporter is created")

        const mailOptions={
            from:process.env.EMAIL_USER,
            to:email,
            subject:'OTP for authentication',
            text:`Your OPT code is ${otp}. It is valid for 5 minutes`
        }

        await transporter.verify(function(error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready to send emails",success);
                console.log("Public Key:", process.env.MJ_APIKEY_PUBLIC);
                console.log("Private Key:", process.env.MJ_APIKEY_PRIVATE);
                console.log("Email User:", process.env.EMAIL_USER);


            }
        });
        

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
