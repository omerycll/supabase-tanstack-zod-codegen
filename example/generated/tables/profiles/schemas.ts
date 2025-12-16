import { z } from 'zod';

export const ProfileSchema = z.object({
  first_name: z.string().nullable(),
  id: z.string(),
  last_name: z.string().nullable(),
});

export const AddProfileRequestSchema = z.object({
  first_name: z.string().nullable().optional(),
  id: z.string(),
  last_name: z.string().nullable().optional(),
});

export const UpdateProfileRequestSchema = z
  .object({
    first_name: z.string().nullable().optional(),
    last_name: z.string().nullable().optional(),
  })
  .extend({ id: z.string() });

export type Profile = z.infer<typeof ProfileSchema>;

export type AddProfileRequest = z.infer<typeof AddProfileRequestSchema>;

export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;
