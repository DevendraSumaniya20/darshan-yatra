import type { Env } from '../infrastructure/config/env.ts';

/**
 * Composition root. The only place that constructs repositories and use cases.
 */
export type Container = {
  env: Env;
  shutdown: () => Promise<void>;
};

export function buildContainer(env: Env): Container {
  return {
    env,
    shutdown: async () => {},
  };
}
