import path from 'node:path';
import cors from 'cors';
import express, { type Express } from 'express';
import { errorHandler, notFoundHandler } from '../presentation/http/middleware/error-handler.ts';
import { requestId } from '../presentation/http/middleware/request-id.ts';
import { bookingRouter } from '../presentation/http/routes/bookings.ts';
import { healthRouter } from '../presentation/http/routes/health.ts';
import { yatraRouter } from '../presentation/http/routes/yatras.ts';
import type { Container } from './container.ts';

export function createApp(container: Container): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(requestId);
  app.use(cors({ origin: container.env.corsOrigin }));
  app.use(express.json({ limit: '32kb' }));

  // Photographs are files, not API resources, so they sit outside /api/v1.
  app.use(
    '/media',
    express.static(path.resolve(container.env.mediaDir), {
      index: false,
      dotfiles: 'ignore',
      maxAge: '7d',
    }),
  );

  app.use('/api/v1', healthRouter());
  app.use('/api/v1', yatraRouter(container.controllers.yatras));
  app.use('/api/v1', bookingRouter(container.controllers.bookings));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
