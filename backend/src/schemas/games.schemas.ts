import { z } from 'zod';

export const ScoreSubmissionSchema = z.object({
  game_type: z.string().min(1),
  score: z.number().int(),
});

export const LeaderboardRequestSchema = z.object({
  game_type: z.string().min(1),
});

export const ScoreResponseSchema = z.object({
  id: z.number().int(),
  user_id: z.number().int(),
  game_type: z.string(),
  score: z.number().int(),
  timestamp: z.string(),
});

export type ScoreSubmission = z.infer<typeof ScoreSubmissionSchema>;
export type LeaderboardRequest = z.infer<typeof LeaderboardRequestSchema>;
export type ScoreResponse = z.infer<typeof ScoreResponseSchema>;
