import 'dotenv/config';
import { z } from 'zod';

const schema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(5000),
    CORS_ORIGIN: z.string().default('http://localhost:5173'),
    DATA_SOURCE: z.enum(['prisma', 'memory']).default('prisma'),
    DATABASE_URL: z.string().optional(),
    MEDIA_DIR: z.string().min(1).default('media'),
  })
  .refine((env) => env.DATA_SOURCE === 'memory' || Boolean(env.DATABASE_URL), {
    path: ['DATABASE_URL'],
    message: 'is required when DATA_SOURCE=prisma',
  });

export type Env = {
  nodeEnv: 'development' | 'test' | 'production';
  port: number;
  corsOrigin: string;
  dataSource: 'prisma' | 'memory';
  databaseUrl: string | null;
  /** Folder holding the photographs served under `/media`. Relative paths start at the working directory. */
  mediaDir: string;
};

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = schema.safeParse(source);
  if (!parsed.success) {
    const problems = parsed.error.issues
      .map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${problems}`);
  }
  const env = parsed.data;
  return {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    corsOrigin: env.CORS_ORIGIN,
    dataSource: env.DATA_SOURCE,
    databaseUrl: env.DATABASE_URL ?? null,
    mediaDir: env.MEDIA_DIR,
  };
}
