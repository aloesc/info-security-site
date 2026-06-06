import { z } from 'zod';

export const ProgressUpdateSchema = z.object({
  user_id: z.string().min(1),
  completed_guides: z.array(z.string()),
  achievements: z.array(z.string()),
});

export const ProgressResponseSchema = z.object({
  user_id: z.number().int(),
  completed_guides: z.array(z.string()),
  achievements: z.array(z.string()),
  updated_at: z.string(),
});

export type ProgressUpdate = z.infer<typeof ProgressUpdateSchema>;
export type ProgressResponse = z.infer<typeof ProgressResponseSchema>;
