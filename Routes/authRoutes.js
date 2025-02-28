import express, { Router } from 'express';
const router=express.Router()
import { signin, signup, generateOTP, verify } from '../Controllers/autho_controller.js';


router.post('/generateOTP', generateOTP);
router.post('/verify', verify);
router.post('/signup', signup);
router.post('/signin', signin);

/* router.put('./update', update)
router.get('.get', get) */
export default router;