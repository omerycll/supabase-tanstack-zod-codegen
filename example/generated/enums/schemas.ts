import { z } from 'zod';

export const TodoStatusSchema = z.enum([
  'pending',
  'in_progress',
  'completed',
  'cancelled',
]);

export type TodoStatus = z.infer<typeof TodoStatusSchema>;

export const PriorityLevelSchema = z.enum(['low', 'medium', 'high', 'urgent']);

export type PriorityLevel = z.infer<typeof PriorityLevelSchema>;
