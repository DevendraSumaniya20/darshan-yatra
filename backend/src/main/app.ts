import cors from 'cors';
import express, { type Express } from 'express';
import { errorHandler, notFoundHandler } from '../presentation/http/middleware/error-handler.ts';
import { requestId } from '../presentation/http/middleware/request-id.ts';
import { healthRouter } from '../presentation/http/routes/health.ts';
import { yatraRouter } from '../presentation/http/routes/yatras.ts';
import type { Container } from './container.ts';

export function createApp(container: Container): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(requestId);
  app.use(cors({ origin: container.env.corsOrigin }));
  app.use(express.json({ limit: '32kb' }));

  app.use('/api/v1', healthRouter());
  app.use('/api/v1', yatraRouter(container.controllers.yatras));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
