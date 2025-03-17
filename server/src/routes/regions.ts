import express from 'express';
import * as dataService from '../services/dataService';

export const regionsRouter = express.Router();

// Hämta alla regioner
regionsRouter.get('/', async (req, res, next) => {
  try {
    const regions = await dataService.getRegions();
    res.json(regions);
  } catch (error) {
    next(error);
  }
}); 