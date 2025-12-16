import { z } from 'zod';

export const GetUserProfileArgsSchema = z.object({
  user_id: z.string(),
});

export const GetUserProfileReturnsSchema = z
  .object({
    id: z.string().nullable(),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
  })
  .nullable();

export type GetUserProfileArgs = z.infer<typeof GetUserProfileArgsSchema>;

export type GetUserProfileReturns = z.infer<typeof GetUserProfileReturnsSchema>;

export const CreateTodoArgsSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const CreateTodoReturnsSchema = z
  .object({ id: z.string().nullable() })
  .nullable();

export type CreateTodoArgs = z.infer<typeof CreateTodoArgsSchema>;

export type CreateTodoReturns = z.infer<typeof CreateTodoReturnsSchema>;

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

export const SearchTodosArgsSchema = z.object({
  search_term: z.string(),
  limit_count: z.number().optional(),
});

export const SearchTodosReturnsSchema = z
  .array(
    z.object({
      id: z.string().nullable(),
      name: z.string().nullable(),
      description: z.string().nullable(),
    })
  )
  .nullable()
  .nullable();

export type SearchTodosArgs = z.infer<typeof SearchTodosArgsSchema>;

export type SearchTodosReturns = z.infer<typeof SearchTodosReturnsSchema>;
