import { z } from 'zod';

export const CreateTagSchema = z.object({
  name: z.string().min(1, 'Tag name is required').max(50, 'Tag name too long'),
});

export const TagQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(50),
  search: z.string().optional(),
});

export type CreateTagInput = z.infer<typeof CreateTagSchema>;
export type TagQueryInput = z.infer<typeof TagQuerySchema>;
