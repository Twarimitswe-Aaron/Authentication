import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config();

//create otp sender via email
const sendOTP= async (email, otp)=>{
    console.log("sendOTP is called"); 
    try{

        //create a transporter of created emails
        const transporter = nodemailer.createTransport({
            host:process.env.SMTP_HOST, 
            port: process.env.SMTP_PORT, 
            secure: false,
            auth: {
                user:process.env.SMTP_USER,
                pass: process.env.SMTP_PASS, 
            },
            tls:{
                 ciphers: 'SSLv3'
            },
        });

        console.log("Transporter is created")

        //create content within sent email

        const mailOptions={
            from:process.env.EMAIL_USER,
            to:email,
            subject:'OTP for authentication',
            text:`Your OPT code is ${otp}. It is valid for 5 minutes`
        }

        //verify if transporter is working property

        await transporter.verify(function(error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready to send emails",success);
               


            }
        });

        //send email to the user This is the one which is not working as intended
        

        try {
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
