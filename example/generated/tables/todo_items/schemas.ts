import { z } from 'zod';

export const TodoItemSchema = z.object({
  created_at: z.string(),
  description: z.string(),
  id: z.string(),
  name: z.string(),
});

export const AddTodoItemRequestSchema = z.object({
  created_at: z.string().optional(),
  description: z.string(),
  id: z.string().optional(),
  name: z.string(),
});

export const UpdateTodoItemRequestSchema = z
  .object({
    created_at: z.string().optional(),
    description: z.string().optional(),
    name: z.string().optional(),
  })
  .extend({ id: z.string() });

export type TodoItem = z.infer<typeof TodoItemSchema>;

export type AddTodoItemRequest = z.infer<typeof AddTodoItemRequestSchema>;

export type UpdateTodoItemRequest = z.infer<typeof UpdateTodoItemRequestSchema>;
