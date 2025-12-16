import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from '@tanstack/react-query';
import { supabase } from '../../../supabase';
import {
  CreateTodoArgsSchema,
  CreateTodoReturnsSchema,
  CreateTodoArgs,
  CreateTodoReturns,
} from './schemas';

interface CreateTodoMutationOptions
  extends Omit<
    UseMutationOptions<CreateTodoReturns, Error, CreateTodoArgs, unknown>,
    'mutationFn'
  > {
  queryInvalidate?: string[][];
}

export function useCreateTodo(options?: CreateTodoMutationOptions) {
  const queryClient = useQueryClient();
  const { queryInvalidate, onSuccess, ...mutationOptions } = options ?? {};
  return useMutation({
    mutationFn: async (args: CreateTodoArgs) => {
      const argsResult = CreateTodoArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'create_todo',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = CreateTodoReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...mutationOptions,
    onSuccess: (...args) => {
      if (queryInvalidate) {
        queryInvalidate.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      onSuccess?.(...args);
    },
  });
}
