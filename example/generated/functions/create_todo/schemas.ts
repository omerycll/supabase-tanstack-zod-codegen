import { z } from 'zod';

export const CreateTodoArgsSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const CreateTodoReturnsSchema = z
  .object({ id: z.string().nullable() })
  .nullable();

export type CreateTodoArgs = z.infer<typeof CreateTodoArgsSchema>;

export type CreateTodoReturns = z.infer<typeof CreateTodoReturnsSchema>;
