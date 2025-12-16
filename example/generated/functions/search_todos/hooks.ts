import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '../../../supabase';
import {
  SearchTodosArgsSchema,
  SearchTodosReturnsSchema,
  SearchTodosArgs,
  SearchTodosReturns,
} from './schemas';

type SearchTodosQueryOptions = Omit<
  UseQueryOptions<SearchTodosReturns, Error>,
  'queryKey' | 'queryFn'
> & { queryKey?: unknown[] };

export function useSearchTodos(
  args: SearchTodosArgs,
  options?: SearchTodosQueryOptions
) {
  const { queryKey, ...queryOptions } = options ?? {};
  return useQuery({
    queryKey: queryKey ?? ['search_todos', args],
    queryFn: async () => {
      const argsResult = SearchTodosArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'search_todos',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = SearchTodosReturnsSchema.safeParse(data);
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
