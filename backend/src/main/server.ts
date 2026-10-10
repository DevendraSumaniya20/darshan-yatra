import { loadEnv } from '../infrastructure/config/env.ts';
import { createApp } from './app.ts';
import { buildContainer } from './container.ts';

function start(): void {
  let env;
  try {
    env = loadEnv();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }

  const container = buildContainer(env);
  const app = createApp(container);

  const server = app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port} (data source: ${env.dataSource})`);
  });

  const stop = (): void => {
    server.close(() => {
      void container.shutdown().finally(() => process.exit(0));
    });
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}

start();
