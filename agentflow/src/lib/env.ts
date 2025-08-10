import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string({ required_error: 'NEXT_PUBLIC_SUPABASE_URL is required' })
    .url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string({ required_error: 'SUPABASE_SERVICE_ROLE_KEY is required' })
    .min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  NVIDIA_API_KEY: z.string().optional(),
  NEXT_PUBLIC_NVIDIA_API_KEY: z.string().optional(),
  NVIDIA_BASE_URL: z.string().optional(),
  NEXT_PUBLIC_NVIDIA_BASE_URL: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('; ');
  throw new Error(`Environment variable validation error: ${issues}`);
}

export const env = parsed.data;
export type Env = typeof env;
