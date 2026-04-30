import { Router } from 'express';
import { planTrip, getMyTrips, getTripById } from '../controllers/trip.controller';

export const tripRouter = Router();

tripRouter.get('/ping', (_req, res) => {
  res.status(200).json({ ok: true, message: 'trip router ready' });
});

tripRouter.post('/plan', planTrip);
tripRouter.get('/my-trips', getMyTrips);
tripRouter.get('/:id', getTripById);