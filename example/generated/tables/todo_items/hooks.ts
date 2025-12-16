import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../supabase';
import {
  AddTodoItemRequestSchema,
  UpdateTodoItemRequestSchema,
  TodoItem,
  AddTodoItemRequest,
  UpdateTodoItemRequest,
} from './schemas';
import { QueryOptions, PaginatedResponse, applyFilters } from '../../common';

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
