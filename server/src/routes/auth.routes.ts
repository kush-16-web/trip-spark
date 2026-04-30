import { register, login, googleLogin } from "../controllers/auth.controller";
import { Router } from 'express';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/google', googleLogin);