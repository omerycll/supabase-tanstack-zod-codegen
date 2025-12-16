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
