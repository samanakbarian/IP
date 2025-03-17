import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { universitiesRouter } from './routes/universities';
import { statisticsRouter } from './routes/statistics';
import { regionsRouter } from './routes/regions';

// Ladda miljövariabler
dotenv.config();

// Skapa Express-app
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Rutter
app.use('/api/universities', universitiesRouter);
app.use('/api/statistics', statisticsRouter);
app.use('/api/regions', regionsRouter);

// Hälsokontroll
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Felhantering
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internt serverfel',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Något gick fel'
  });
});

// Starta servern
app.listen(port, () => {
  console.log(`Server körs på http://localhost:${port}`);
}); 