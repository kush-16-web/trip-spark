import { Router } from 'express';
import { planTrip, getMyTrips, getTripById, getTripByShareId } from '../controllers/trip.controller';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware';

export const tripRouter = Router();

tripRouter.get('/ping', (_req, res) => {
  res.status(200).json({ ok: true, message: 'trip router ready' });
});

tripRouter.post('/plan', optionalAuthenticate, planTrip);
tripRouter.get('/my-trips', authenticate, getMyTrips);
tripRouter.get('/:id', getTripById);
tripRouter.get('/share/:shareId', getTripByShareId);