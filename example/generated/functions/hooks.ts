import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { z } from 'zod';
import { supabase } from './supabase';

// Filter operators
export const FilterOperatorSchema = z.enum([
  'eq',
  'neq',
  'gt',
  'gte',
  'lt',
  'lte',
  'like',
  'ilike',
  'is',
  'in',
]);
export type FilterOperator = z.infer<typeof FilterOperatorSchema>;

// Single filter condition
export const FilterConditionSchema = z.object({
  column: z.string(),
  operator: FilterOperatorSchema,
  value: z.unknown(),
});
export type FilterCondition = z.infer<typeof FilterConditionSchema>;

// Sort direction
export const SortDirectionSchema = z.enum(['asc', 'desc']);
export type SortDirection = z.infer<typeof SortDirectionSchema>;

// Sort option
export const SortOptionSchema = z.object({
  column: z.string(),
  direction: SortDirectionSchema.optional().default('asc'),
});
export type SortOption = z.infer<typeof SortOptionSchema>;

// Pagination options
export const PaginationSchema = z.object({
  page: z.number().min(1).optional().default(1),
  pageSize: z.number().min(1).max(100).optional().default(10),
});
export type Pagination = z.infer<typeof PaginationSchema>;

// Query options combining filters, sorting, pagination, and select
export const QueryOptionsSchema = z.object({
  enabled: z.boolean().optional(),
  filters: z.array(FilterConditionSchema).optional(),
  sort: SortOptionSchema.optional(),
  pagination: PaginationSchema.optional(),
  select: z.string().optional(),
  queryKey: z.array(z.unknown()).optional(),
});
export type QueryOptions = z.infer<typeof QueryOptionsSchema>;

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

function applyFilters<T>(query: T, filters?: FilterCondition[]): T {
  if (!filters || filters.length === 0) return query;

  let result = query as any;
  for (const filter of filters) {
    const { column, operator, value } = filter;
    switch (operator) {
      case 'eq':
        result = result.eq(column, value);
        break;
      case 'neq':
        result = result.neq(column, value);
        break;
      case 'gt':
        result = result.gt(column, value);
        break;
      case 'gte':
        result = result.gte(column, value);
        break;
      case 'lt':
        result = result.lt(column, value);
        break;
      case 'lte':
        result = result.lte(column, value);
        break;
      case 'like':
        result = result.like(column, value);
        break;
      case 'ilike':
        result = result.ilike(column, value);
        break;
      case 'is':
        result = result.is(column, value);
        break;
      case 'in':
        result = result.in(column, value as any[]);
        break;
    }
  }
  return result as T;
}

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
