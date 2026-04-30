import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { firebaseAdmin } from '../lib/firebaseAdmin';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev_secret_change_this';
const JWT_EXPIRATION = '7d';

type AuthBody = {
  email?: string;
  password?: string;
}

type GoogleAuthBody = {
  idToken?: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLocaleLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function register(req: Request<unknown, unknown, AuthBody>, res: Response) {
  try{
    const emailRaw = req.body.email ?? '';
    const passwordRaw = req.body.password ?? '';
    const email = normalizeEmail(emailRaw);
    
    // 1) validate email/password
    if(!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    if(passwordRaw.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // 2) check existing user
    const existing = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existing) {
      return res.status(409).json({ ok: false, message: 'Email already registered' });
    }

    // 3) hash password
    const passwordHash = await bcrypt.hash(passwordRaw, 10);

    // 4) create user
    const user = await prisma.user.create({
      data: { email, passwordHash},
      select: { id: true, email: true, createdAt: true },
    });
    
    // 5) sign token
    const token = jwt.sign({ sub: user.id, email: user.email}, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    // 6) return token + user
    return res.status(201).json({ ok: true, token, user });
  } catch (error) {
    console.error('[auth.register] failed to register user', error);
    return res.status(500).json({ ok: false, message: 'Unable to register right now' });
  }
}

export async function login(req: Request<unknown, unknown, AuthBody>, res: Response) {
  try{
    const emailRaw = req.body.email ?? '';
    const password = req.body.password ?? '';
    const email = normalizeEmail(emailRaw);

    if(!isValidEmail(email) || !password){
      return res.status(400).json({ ok: false, message: 'Email and password are required' });
    }

    const userRow = await prisma.user.findUnique({
      where: {email},
      select: {id: true, email: true, passwordHash: true, createdAt: true},
    })

    if(!userRow){
      return res.status(401).json({ ok: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, userRow.passwordHash);
    if(!isMatch){
      return res.status(401).json({ ok: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ sub: userRow.id, email: userRow.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });
    return res.status(200).json({ ok: true, token,
      user: {
        id: userRow.id,
        email: userRow.email,
        createdAt: userRow.createdAt,
      },
    });
  } catch (error) {
    console.error('[auth.login] failed to login user', error);
    return res.status(500).json({ ok: false, message: 'Unable to login right now' });
  }
}

export async function googleLogin(
  req: Request<unknown, unknown, GoogleAuthBody>,
  res: Response,
) {
  try {
    const idToken = req.body.idToken;
    if (!idToken) {
      return res.status(400).json({ ok: false, message: 'Missing idToken' });
    }

    const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
    const email = decoded.email?.toLowerCase();

    if (!email) {
      return res.status(400).json({ ok: false, message: 'Google email not available' });
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        // Current schema requires passwordHash. For Google-only accounts,
        // we store an unusable placeholder and rely on OAuth login.
        passwordHash: 'GOOGLE_OAUTH_ONLY',
      },
      select: { id: true, email: true, createdAt: true },
    });

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION },
    );

    return res.status(200).json({ ok: true, token, user });
  } catch (error) {
    console.error('[auth.googleLogin] failed to verify Google token', error);
    return res.status(401).json({ ok: false, message: 'Invalid Google token' });
  }
}