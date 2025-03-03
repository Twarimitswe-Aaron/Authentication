import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import router from './Routes/authRoutes.js';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';


const app = express();
config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connect to DB
async function connectDB() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to database');
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
}
connectDB();

//Middleware for sessions
app.use(cors({origin:`http://localhost:${process.env.PORT}`, credentials:true}))
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:true,
    saveUninitialized:true,
}));

//Initialize passport
app.use(passport.initialize());
app.use(passport.session())


//Directing to the main routes

app.use('/auth_demo', router);


const PORT = process.env.PORT;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server error:', err);
});
