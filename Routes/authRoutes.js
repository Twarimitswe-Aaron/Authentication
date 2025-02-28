import express, { Router } from 'express';
const router=express.Router()
import { signin, resetPass, generateOTP, verifyReset } from '../Controllers/autho_controller.js';


router.post('/generateOTP', generateOTP);
router.post('/resetPass', resetPass);
router.post('/signin', signin);
router.post('/verifyReset', verifyReset);

/* router.put('./update', update)
router.get('.get', get) */
export default router;