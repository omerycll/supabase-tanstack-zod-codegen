import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
  filters: z.array(FilterConditionSchema).optional(),
  sort: SortOptionSchema.optional(),
  pagination: PaginationSchema.optional(),
  select: z.string().optional(),
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

export const GetUserProfileArgsSchema = z.object({
  user_id: z.string(),
});

export const GetUserProfileReturnsSchema = z
  .object({
    id: z.string(),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
  })
  .nullable();

export const CreateUserProfileArgsSchema = z.object({
  user_id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
});

export const CreateUserProfileReturnsSchema = z
  .object({ id: z.string() })
  .nullable();

export const EnumsArgsSchema = z.object({});

export const EnumsReturnsSchema = z.unknown().nullable();

export const CompositeTypesArgsSchema = z.object({});

export const CompositeTypesReturnsSchema = z.unknown().nullable();

export type TodoItem = z.infer<typeof TodoItemSchema>;
export type AddTodoItemRequest = z.infer<typeof AddTodoItemRequestSchema>;
export type UpdateTodoItemRequest = z.infer<typeof UpdateTodoItemRequestSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type AddProfileRequest = z.infer<typeof AddProfileRequestSchema>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;
export type GetUserProfileArgs = z.infer<typeof GetUserProfileArgsSchema>;
export type GetUserProfileReturns = z.infer<typeof GetUserProfileReturnsSchema>;
export type CreateUserProfileArgs = z.infer<typeof CreateUserProfileArgsSchema>;
export type CreateUserProfileReturns = z.infer<
  typeof CreateUserProfileReturnsSchema
>;
export type EnumsArgs = z.infer<typeof EnumsArgsSchema>;
export type EnumsReturns = z.infer<typeof EnumsReturnsSchema>;
export type CompositeTypesArgs = z.infer<typeof CompositeTypesArgsSchema>;
export type CompositeTypesReturns = z.infer<typeof CompositeTypesReturnsSchema>;

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
    queryKey: ['todo_items', options],
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
        data: data as TodoItem[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
  });
}

export function useAddTodoItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddTodoItemRequest) => {
      const validated = AddTodoItemRequestSchema.parse(item);
      const { data, error } = await supabase
        .from('todo_items')
        .insert(validated as never)
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
      const { id, ...updates } = UpdateTodoItemRequestSchema.parse(item);
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
      const validated = items.map((item) =>
        AddTodoItemRequestSchema.parse(item)
      );
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
      for (const item of items) {
        const { id, ...updates } = UpdateTodoItemRequestSchema.parse(item);
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

export function useGetProfile(id: string) {
  return useQuery<Profile, Error>({
    queryKey: ['profiles', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as Profile;
    },
    enabled: !!id,
  });
}

export function useGetAllProfiles(options?: QueryOptions) {
  return useQuery<PaginatedResponse<Profile>, Error>({
    queryKey: ['profiles', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('profiles')
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
        data: data as Profile[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
  });
}

export function useAddProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddProfileRequest) => {
      const validated = AddProfileRequestSchema.parse(item);
      const { data, error } = await supabase
        .from('profiles')
        .insert(validated as never)
        .select()
        .single();
      if (error) throw error;
      return data as Profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateProfileRequest) => {
      const { id, ...updates } = UpdateProfileRequestSchema.parse(item);
      const { data, error } = await supabase
        .from('profiles')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

export function useDeleteProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

export function useBulkAddProfiles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddProfileRequest[]) => {
      const validated = items.map((item) =>
        AddProfileRequestSchema.parse(item)
      );
      const { data, error } = await supabase
        .from('profiles')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as Profile[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

export function useBulkUpdateProfiles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateProfileRequest[]) => {
      const results: Profile[] = [];
      for (const item of items) {
        const { id, ...updates } = UpdateProfileRequestSchema.parse(item);
        const { data, error } = await supabase
          .from('profiles')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as Profile);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

export function useBulkDeleteProfiles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from('profiles').delete().in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

export function useGetUserProfile(args: GetUserProfileArgs) {
  return useQuery({
    queryKey: ['get_user_profile', args],
    queryFn: async () => {
      const validated = GetUserProfileArgsSchema.parse(args);
      const { data, error } = await supabase.rpc(
        'get_user_profile',
        validated as never
      );
      if (error) throw error;
      return GetUserProfileReturnsSchema.parse(data);
    },
  });
}

export function useCreateUserProfile() {
  return useMutation({
    mutationFn: async (args: CreateUserProfileArgs) => {
      const validated = CreateUserProfileArgsSchema.parse(args);
      const { data, error } = await supabase.rpc(
        'create_user_profile',
        validated as never
      );
      if (error) throw error;
      return CreateUserProfileReturnsSchema.parse(data);
    },
  });
}

export function useEnums(args: EnumsArgs) {
  return useQuery({
    queryKey: ['Enums', args],
    queryFn: async () => {
      const validated = EnumsArgsSchema.parse(args);
      const { data, error } = await supabase.rpc('Enums', validated as never);
      if (error) throw error;
      return EnumsReturnsSchema.parse(data);
    },
  });
}

export function useCompositeTypes(args: CompositeTypesArgs) {
  return useQuery({
    queryKey: ['CompositeTypes', args],
    queryFn: async () => {
      const validated = CompositeTypesArgsSchema.parse(args);
      const { data, error } = await supabase.rpc(
        'CompositeTypes',
        validated as never
      );
      if (error) throw error;
      return CompositeTypesReturnsSchema.parse(data);
    },
  });
}
