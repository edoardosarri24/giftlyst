import { Router } from 'express';
import { register, login, logout, refresh, verifyEmail, forgotPassword, resetPassword, resendVerification } from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validate';
import { RegisterUserSchema, LoginUserSchema, VerifyEmailSchema, ForgotPasswordSchema, ResetPasswordSchema, ResendVerificationSchema } from '@regalamelo/shared';

const router = Router();

router.post('/register', validateBody(RegisterUserSchema), register);
router.post('/resend-verification', validateBody(ResendVerificationSchema), resendVerification);
router.post('/verify-email', validateBody(VerifyEmailSchema), verifyEmail);
router.post('/login', validateBody(LoginUserSchema), login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.post('/forgot-password', validateBody(ForgotPasswordSchema), forgotPassword);
router.post('/reset-password', validateBody(ResetPasswordSchema), resetPassword);

export default router;
