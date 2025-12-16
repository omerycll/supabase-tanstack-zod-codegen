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

export const TodoItemSchema = z.object({
  created_at: z.string(),
  description: z.string(),
  id: z.string(),
  name: z.string(),
});

export const AddTodoItemRequestSchema = z.object({
  created_at: z.string().optional(),
  description: z.string(),
  id: z.string().optional(),
  name: z.string(),
});

export const UpdateTodoItemRequestSchema = z
  .object({
    created_at: z.string().optional(),
    description: z.string().optional(),
    name: z.string().optional(),
  })
  .extend({ id: z.string() });

export type TodoItem = z.infer<typeof TodoItemSchema>;

export type AddTodoItemRequest = z.infer<typeof AddTodoItemRequestSchema>;

export type UpdateTodoItemRequest = z.infer<typeof UpdateTodoItemRequestSchema>;

export function useGetTodoItem(id: string) {
  return useQuery<TodoItem, Error>({
    queryKey: ['todo_items', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('todo_items')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as TodoItem;
    },
    enabled: !!id,
  });
}

export function useGetAllTodoItems(options?: QueryOptions) {
  return useQuery<PaginatedResponse<TodoItem>, Error>({
    queryKey: options?.queryKey ?? ['todo_items', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('todo_items')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as TodoItem[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddTodoItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddTodoItemRequest) => {
      const result = AddTodoItemRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('todo_items')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as TodoItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo_items'] });
    },
  });
}

export function useUpdateTodoItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateTodoItemRequest) => {
      const result = UpdateTodoItemRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('todo_items')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as TodoItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo_items'] });
    },
  });
}

export function useDeleteTodoItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('todo_items').delete().eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo_items'] });
    },
  });
}

export function useBulkAddTodoItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddTodoItemRequest[]) => {
      const validated: AddTodoItemRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddTodoItemRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('todo_items')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as TodoItem[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo_items'] });
    },
  });
}

export function useBulkUpdateTodoItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateTodoItemRequest[]) => {
      const results: TodoItem[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateTodoItemRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('todo_items')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as TodoItem);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo_items'] });
    },
  });
}

export function useBulkDeleteTodoItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('todo_items')
        .delete()
        .in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo_items'] });
    },
  });
}
