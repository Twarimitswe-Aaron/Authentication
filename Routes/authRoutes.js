import express from 'express';
const router=express.Router()
import authController from '../Controllers/auth_controller.js';




router.post('/generateOTP', authController.generateOTP);
router.post('/resetPass', authController.resetPass);
router.post('/signin', authController.signin);
router.post('/verifyReset', authController.verifyReset);
router.post('/verifyEmail',authController.verifyEmail);
router.get("/google",authController.googleLogin);
router.get('/google/callback', authController.googleCallback, authController.successRedirect);
router.get('/logout',authController.logout);


export default router;