import { Router } from 'express';
import type { YatraController } from '../controllers/yatra-controller.ts';

export function yatraRouter(controller: YatraController): Router {
  const router = Router();
  router.get('/yatras', controller.list);
  router.get('/yatras/:slug', controller.detail);
  router.get('/start-cities', controller.startCities);
  return router;
}
