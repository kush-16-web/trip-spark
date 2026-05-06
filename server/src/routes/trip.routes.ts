import { Router } from 'express';
import { 
  planTrip, 
  getMyTrips, 
  getTripById, 
  getTripByShareId, 
  updatetrip, 
  deletetrip, 
  generateSingleDay, 
  getTripWeather,
  generateBudgetOnly,
  generateSummaryOnly,
  getExchangeRate,
  saveTrip,
} from '../controllers/trip.controller';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware';

export const tripRouter = Router();

tripRouter.get('/ping', (_req, res) => {
  res.status(200).json({ ok: true, message: 'trip router ready' });
});

tripRouter.post('/plan', optionalAuthenticate, planTrip);
tripRouter.get('/my-trips', authenticate, getMyTrips);
tripRouter.get('/:id', getTripById);
tripRouter.get('/share/:shareId', getTripByShareId);
tripRouter.put('/update/:id', authenticate, updatetrip);
tripRouter.delete('/delete/:id', authenticate, deletetrip);    

tripRouter.post("/generate-day", generateSingleDay);
tripRouter.get("/weather/:destination/:startDate/:endDate", getTripWeather);
tripRouter.post("/generate-budget", generateBudgetOnly);
tripRouter.post("/generate-summary", generateSummaryOnly);
tripRouter.get("/exchange-rate/:base/:target", getExchangeRate);
tripRouter.post("/save", authenticate, saveTrip);