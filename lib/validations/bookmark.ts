import { z } from 'zod';

export const CreateBookmarkSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(false),
});

export const UpdateBookmarkSchema = z.object({
  url: z.string().url('Please enter a valid URL').optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
});

export const BookmarkQuerySchema = z.object({
  search: z.string().optional(),
  tag: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export type CreateBookmarkInput = z.infer<typeof CreateBookmarkSchema>;
export type UpdateBookmarkInput = z.infer<typeof UpdateBookmarkSchema>;
export type BookmarkQueryInput = z.infer<typeof BookmarkQuerySchema>;
