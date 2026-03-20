import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { env } from './config/env.js';
import { notFoundMiddleware, errorMiddleware } from './middlewares/error.middleware.js';
import { normalizeUrlMiddleware } from './middlewares/normalize-url.middleware.js';
import { router } from './routes/index.js';

const app = express();

const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
});

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(limiter);
app.use(normalizeUrlMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/health', (_request, response) => {
  response.status(200).json({
    success: true,
    message: 'Server is healthy',
    data: {
      service: 'askida-mama-server',
      environment: env.NODE_ENV,
    },
  });
});

app.use(env.API_PREFIX, router);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app };
