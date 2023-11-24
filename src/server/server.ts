import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response, NextFunction } from 'express';
import { rateLimit } from 'express-rate-limit';
import mongoose from 'mongoose';
import path from 'path';
import http from 'http';
import util from 'util';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import apiRoutes from './routes/apiRoutes';
import CustomError from './utils/CustomError';

const app: Express = express();
const MODE = process.env.NODE_ENV || 'development';
const HOST_NAME = '0.0.0.0';
const PORT = 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || '';
const URI = process.env.DATABASE_URL || 'mongodb://localhost:27017';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

let server: http.Server | null = null;

// wrap server in start and stop functions to handle graceful shutdown and testing
export const startServer = async (): Promise<http.Server | undefined> => {
  if (server) {
    console.log('Server already started');
    return;
  }

  // Connect to MongoDB
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(URI, {
      dbName: 'linkedin-mastermind',
    });
    console.log('Connected to MongoDB ✅');
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error}`);
    process.exit(1);
  }

  server = app.listen(PORT, HOST_NAME, () => {
    console.log(`Server running at http://${HOST_NAME}:${PORT}/`);
  });
};

export const stopServer = async (): Promise<void> => {
  if (server) {
    server.close((err) => {
      if (err) {
        console.error(`Error closing server: ${err}`);
        return;
      }
      console.log('Sever closed successfully 🚪');
      server = null;
    });
  }

  try {
    console.log('Disconnecting from MongoDB...');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB ⛔️');
  } catch (error) {
    console.log(`❌ Failed to disconnect from MongoDB: ${error}`);
  }
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
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
    cookie: {
      httpOnly: true,
      secure: MODE === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// api routes
app.use('/api', limiter); // limit api requests
app.use('/api', apiRoutes); // use a router to contain all api routes

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

  app.get('/test-custom-error', (req: Request, res: Response, next: NextFunction) => {
    // create a custom error with an arbitrary status code
    const error = new CustomError('Test error', 418);
    // pass the error to the next middleware
    return next(error);
  });
} else {
  startServer();
}

// global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack || util.inspect(err));

  const statusCode = err instanceof CustomError ? err.statusCode : 500;
  const message = MODE === 'production' ? 'An error occurred' : err.message;

  res.status(statusCode).json({ message });
});

// helper function for graceful shutdown
const shutdown = async (sig: string) => {
  console.log(`Received ${sig}. Gracefully shutting server down...`);
  await stopServer();
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
