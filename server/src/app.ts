import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import { env } from './config/env';
import { tripRouter } from './routes/trip.routes';

export const app = express();

/**
 * CORS: allow frontend dev server to call backend.
 * Later you can tighten this for production domains.
 */
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow local development, configured CLIENT_ORIGIN, and any trycloudflare tunnel
      if (
        !origin || 
        origin === env.CLIENT_ORIGIN || 
        origin.includes("localhost") || 
        origin.endsWith(".trycloudflare.com")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

/**
 * Parse JSON body from incoming requests.
 * Example: POST /api/trip/plan with { Destination, days, ... }
 */
app.use(express.json({ limit: '1mb' }));

/**
 * Simple health endpoint to verify server is alive.
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    ok: true,
    service: 'trip-spark-api',
    env: env.NODE_ENV,
  });
});

/**
 * Mount feature routes.
 * Trip logic will be added by you in trip.routes/controller later.
 */
app.use('/api/trip', tripRouter);

/**
 * 404 handler for unknown routes.
 */
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    ok: false,
    message: 'Route not found',
  });
});

/**
 * Global error handler.
 * Keep this last in middleware chain.
 */
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled app error:', err);

  res.status(500).json({
    ok: false,
    message: 'Internal server error',
  });
});