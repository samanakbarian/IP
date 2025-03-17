import express from 'express';
import * as dataService from '../services/dataService';

export const universitiesRouter = express.Router();

// Hämta alla lärosäten
universitiesRouter.get('/', async (req, res, next) => {
  try {
    const universities = await dataService.getUniversities();
    res.json(universities);
  } catch (error) {
    next(error);
  }
});

// Hämta aggregerad statistik för ett lärosäte
universitiesRouter.get('/:universityId/statistics', async (req, res, next) => {
  try {
    const { universityId } = req.params;
    const statistics = await dataService.getUniversityStatistics(universityId);
    res.json(statistics);
  } catch (error) {
    next(error);
  }
});

// Hämta geografisk fördelning för ett lärosäte
universitiesRouter.get('/:universityId/geographic-distribution', async (req, res, next) => {
  try {
    const { universityId } = req.params;
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;
    const distribution = await dataService.getGeographicDistribution(universityId, year);
    res.json(distribution);
  } catch (error) {
    next(error);
  }
});

// Hämta könsfördelning för ett lärosäte
universitiesRouter.get('/:universityId/gender-distribution', async (req, res, next) => {
  try {
    const { universityId } = req.params;
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;
    const programId = req.query.programId as string | undefined;
    const distribution = await dataService.getGenderDistribution(universityId, year, programId);
    res.json(distribution);
  } catch (error) {
    next(error);
  }
}); 