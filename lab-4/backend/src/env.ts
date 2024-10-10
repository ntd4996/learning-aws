import { z } from 'zod';

export const EnvSchema = z.object({
  HOST: z.coerce.string().optional().default('0.0.0.0'),
  PORT: z.coerce.number().optional().default(3001),
  SWAGGER_ENABLED: z.coerce.boolean().optional().default(false),
});

export type Env = z.infer<typeof EnvSchema>;
