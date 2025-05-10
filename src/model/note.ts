import { z } from 'zod';

export const NoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
});

export type Note = z.infer<typeof NoteSchema>;
