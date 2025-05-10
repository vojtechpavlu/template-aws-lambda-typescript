import { z } from 'zod';

export const NoteSchema = z.object({
  noteId: z.string(),
  title: z.string(),
  content: z.string(),
  owner: z.string(),
  createdAt: z.string().datetime().optional(),
  modifiedAt: z.string().datetime().optional(),
});

export const NoteInputSchema = z.object({
  title: z.string(),
  content: z.string(),
  owner: z.string(),
});

export type Note = z.infer<typeof NoteSchema>;
export type NoteInput = z.infer<typeof NoteInputSchema>;
