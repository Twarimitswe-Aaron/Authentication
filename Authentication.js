import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import router from './Routes/authRoutes.js';


const app = express();
config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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




app.use('/auth_demo', router);


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server error:', err);
});
