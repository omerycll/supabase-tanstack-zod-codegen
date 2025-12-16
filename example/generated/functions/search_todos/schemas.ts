import { z } from 'zod';

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
