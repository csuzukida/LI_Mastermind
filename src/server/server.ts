import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import http from 'http';
import util from 'util';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import apiRoutes from './routes/apiRoutes';
import CustomError from './utils/CustomError';

// TODO: Implement file logging with winston
// TODO: Implement rate limiting with express-rate-limit
// TODO: Implement helmet for security
// TODO: Implement compression for performance
// TODO: Implement validation with express-validator

const app: Express = express();
const MODE = process.env.NODE_ENV || 'development';
const PORT = 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || '';
const URI = process.env.MONGO_URI || 'mongodb://localhost:27017';

let server: http.Server | null = null;

// Start server function
export const startServer = async (): Promise<http.Server> => {
  if (server) {
    throw new Error('Server is already running');
  }

  // Connect to MongoDB here
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(URI, {
      dbName: 'linkedin-mastermind',
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(error);
  }

  return new Promise((resolve, reject) => {
    server = app
      .listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
        if (server) resolve(server);
      })
      .on('error', reject);
  });
};

// Stop server function
export const stopServer = async (): Promise<void> => {
  await mongoose.disconnect();
  await new Promise<void>((resolve, reject) => {
    if (server) {
      server.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        server = null;
        resolve();
      });
    }
  });
};

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      httpOnly: true,
      secure: MODE === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// api routes
app.use('/api', apiRoutes);

// check for prod to serve static assets and index.html, otherwise webpack dev server handles it
if (MODE === 'production') {
  startServer();
  app.use('/client', express.static(path.join(__dirname, '../../dist/client')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../dist/client/index.html'));
  });
} else if (MODE === 'testing') {
  app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
  });
} else {
  startServer();
}

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
  stopServer();
  console.log('Server shutdown complete 👋');
  process.exit(0);
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

export default app;
