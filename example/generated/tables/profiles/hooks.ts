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
    queryKey: options?.queryKey ?? ['profiles', options],
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
        data: data as unknown as Profile[],
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

export function useAddProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddProfileRequest) => {
      const result = AddProfileRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('profiles')
        .insert(result.data as never)
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
      const result = UpdateProfileRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
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
      const validated: AddProfileRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddProfileRequestSchema.safeParse(items[i]);
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
      for (let i = 0; i < items.length; i++) {
        const result = UpdateProfileRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
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
