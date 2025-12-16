import { z } from 'zod';

export const GetUserTodosArgsSchema = z.object({
  user_id: z.string(),
});

export const GetUserTodosReturnsSchema = z
  .array(
    z.object({
      id: z.string().nullable(),
      name: z.string().nullable(),
      description: z.string().nullable(),
      created_at: z.string().nullable(),
    })
  )
  .nullable()
  .nullable();

export type GetUserTodosArgs = z.infer<typeof GetUserTodosArgsSchema>;

export type GetUserTodosReturns = z.infer<typeof GetUserTodosReturnsSchema>;
