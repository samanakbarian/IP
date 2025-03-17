import express from 'express';
import * as dataService from '../services/dataService';
import { StatisticsFilter } from '../models/types';

export const statisticsRouter = express.Router();

// Hämta statistik baserat på filter
statisticsRouter.get('/', async (req, res, next) => {
  try {
    const filter: StatisticsFilter = {
      universityId: req.query.universityId as string | undefined,
      fromYear: req.query.fromYear ? parseInt(req.query.fromYear as string) : undefined,
      toYear: req.query.toYear ? parseInt(req.query.toYear as string) : undefined,
      programId: req.query.programId as string | undefined
    };
    
    const statistics = await dataService.getStatistics(filter);
    res.json(statistics);
  } catch (error) {
    next(error);
  }
}); 