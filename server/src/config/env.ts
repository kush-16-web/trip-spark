import dotenv from 'dotenv';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const PORT = Number(process.env.PORT ?? 8080);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? '';
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash';

if (Number.isNaN(PORT)) {
  throw new Error('Invalid PORT in environment variables');
}

export const env = {
  NODE_ENV,
  PORT,
  CLIENT_ORIGIN,
  GEMINI_API_KEY,
  GEMINI_MODEL,
} as const;