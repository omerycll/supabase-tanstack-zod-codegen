import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '../../../supabase';
import {
  GetUserTodosArgsSchema,
  GetUserTodosReturnsSchema,
  GetUserTodosArgs,
  GetUserTodosReturns,
} from './schemas';

type GetUserTodosQueryOptions = Omit<
  UseQueryOptions<GetUserTodosReturns, Error>,
  'queryKey' | 'queryFn'
> & { queryKey?: unknown[] };

export function useGetUserTodos(
  args: GetUserTodosArgs,
  options?: GetUserTodosQueryOptions
) {
  const { queryKey, ...queryOptions } = options ?? {};
  return useQuery({
    queryKey: queryKey ?? ['get_user_todos', args],
    queryFn: async () => {
      const argsResult = GetUserTodosArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'get_user_todos',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = GetUserTodosReturnsSchema.safeParse(data);
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
