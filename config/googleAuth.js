import google from 'passport-google-oauth20';
import passport from 'passport';
const GoogleStrategy=google.Strategy;

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.GOOGLE_CALLBACK_URL,
},
function(accessToken,refreshToken,profile,done){
    return done(null,profile);
}
));

