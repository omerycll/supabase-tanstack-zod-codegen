import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../supabase';
import {
  AddProfileRequestSchema,
  UpdateProfileRequestSchema,
  Profile,
  AddProfileRequest,
  UpdateProfileRequest,
} from './schemas';
import { QueryOptions, PaginatedResponse, applyFilters } from '../../common';

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
