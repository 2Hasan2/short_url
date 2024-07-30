import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/auth.routes';
import urlRoutes from './routes/Url.routes';
import swaggerOptions from './swagger';
import { MONGO_URI, PORT } from './config';
import path from 'path';

const app = express();

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
};
// Custom Morgan Tokens
morgan.token('date', () => new Date().toISOString());
morgan.token('status', (req, res) => {
  const status = res.statusCode;
  const color =
    status >= 500
      ? colors.red
      : status >= 400
        ? colors.yellow
        : status >= 300
          ? colors.cyan
          : colors.green;
  return `${color}${status}${colors.reset}`;
});
morgan.token(
  'method',
  (req) => `${colors.magenta}${req.method}${colors.reset}`,
);
morgan.token('url', (req) => `${colors.cyan}${req.url}${colors.reset}`);
morgan.token('response-time', (req, res) => {
  const responseTime = res.getHeader('X-Response-Time') || '0';
  return `${colors.blue}${responseTime} ms${colors.reset}`;
});

// Custom Morgan Format
const morganFormat = ':date - :method :url :status - :response-time';

// Middleware
app.use(express.json());
app.use(morgan(morganFormat));

// CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// // Custom Logging Middleware
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//   next();
// });

app.use('/api/auth', authRoutes);
app.use('/api/', urlRoutes);

app.use(express.static(path.join(__dirname, 'static')));

// Serve the index.html file for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// log the error to the console
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  },
);

app.listen(PORT, () => {
  console.log('Server is running on port 5000');
});
