import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '../../../supabase';
import {
  GetUserProfileArgsSchema,
  GetUserProfileReturnsSchema,
  GetUserProfileArgs,
  GetUserProfileReturns,
} from './schemas';

type GetUserProfileQueryOptions = Omit<
  UseQueryOptions<GetUserProfileReturns, Error>,
  'queryKey' | 'queryFn'
> & { queryKey?: unknown[] };

export function useGetUserProfile(
  args: GetUserProfileArgs,
  options?: GetUserProfileQueryOptions
) {
  const { queryKey, ...queryOptions } = options ?? {};
  return useQuery({
    queryKey: queryKey ?? ['get_user_profile', args],
    queryFn: async () => {
      const argsResult = GetUserProfileArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'get_user_profile',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = GetUserProfileReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...queryOptions,
  });
}
