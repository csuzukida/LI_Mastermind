import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
import path from 'path';
import http from 'http';
import util from 'util';
import apiRoutes from './routes/apiRoutes';
import CustomError from '../utils/CustomError';

const app: Express = express();
const MODE = process.env.NODE_ENV || 'development';
const PORT = 3000;

console.log(`Running in ${MODE} mode`);
const server = http.createServer(app).listen(PORT, () => {
  console.log(`⚡️: Server is running at http://localhost:${PORT}`);
});

// check for prod and serve static assets and index.html
if (MODE === 'production') {
  app.use('/client', express.static(path.join(__dirname, '../../dist/client')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../dist/client/index.html'));
  });
}

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// api routes
app.use('/api', apiRoutes);

// global error handler
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack || util.inspect(err));

  const statusCode = err instanceof CustomError ? err.statusCode : 500;
  const message = MODE === 'production' ? 'An error occurred' : err.message;

  res.status(statusCode).json({ message });
});

// helper function for graceful shutdown
const shutdown = (sig: string) => {
  console.log(`Received ${sig}. Gracefully shutting server down...`);
  server.close(() => {
    console.log('Server shutdown complete 👋');
    process.exit(0);
  });
};

// catch SIGTERM, SIGINT, uncaught exceptions, and uncaught rejections
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('uncaughtException', (err: Error) => {
  console.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});
process.on('unhandledRejection', (reason: object | null | undefined, promise: Promise<any>) => {
  console.log(`Unhanlded Rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});
