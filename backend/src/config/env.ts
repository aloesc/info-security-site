import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('4000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_PATH: z.string().min(1).default('./db/app.db'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  SESSION_SECRET: z.string().min(1).optional(),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(rawEnv = process.env): Env {
  const result = envSchema.safeParse(rawEnv);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Environment validation failed: ${issues}`);
  }
  return result.data;
}
