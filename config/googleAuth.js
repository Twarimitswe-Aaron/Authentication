import google from 'passport-google-oauth20';
import passport from 'passport';
import userModel from '../Models/user';
const GoogleStrategy=google.Strategy;
import dotenv from 'dotenv';
dotenv.config();


passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.GOOGLE_CALLBACK_URL,
},
async function(accessToken,refreshToken,profile,done){
    let user=await userModel.findOne({googleId:profile.id});
    if(!user){
        user=new userModel({
            googleId:profile.id,
            name:profile.displayName,
            email:profile.emails[0].value,
            photo:profile.photos[0].value,
        });
        await user.save();
    }
    return done(null,user);
}
));

passport.serializeUser((user,done)=>{
    done(null,user.id)
});

passport.deserializeUser(async(id,done)=>{
    const user=await userModel.findById(id);
    done(null,user);
})

