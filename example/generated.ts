import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { supabase } from './supabase';

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

export type TodoItem = z.infer<typeof TodoItemSchema>;
export type AddTodoItemRequest = z.infer<typeof AddTodoItemRequestSchema>;
export type UpdateTodoItemRequest = z.infer<typeof UpdateTodoItemRequestSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type AddProfileRequest = z.infer<typeof AddProfileRequestSchema>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;

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

export function useGetAllTodoItems() {
  return useQuery<TodoItem[], Error>({
    queryKey: ['todo_items'],
    queryFn: async () => {
      const { data, error } = await supabase.from('todo_items').select();
      if (error) throw error;
      return data as TodoItem[];
    },
  });
}

export function useAddTodoItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddTodoItemRequest) => {
      const validated = AddTodoItemRequestSchema.parse(item);
      const { error } = await supabase
        .from('todo_items')
        .insert(validated as never);
      if (error) throw error;
      return null;
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
      const { error } = await supabase
        .from('todo_items')
        .update(updates as never)
        .eq('id', id);
      if (error) throw error;
      return null;
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

export function useGetAllProfiles() {
  return useQuery<Profile[], Error>({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select();
      if (error) throw error;
      return data as Profile[];
    },
  });
}

export function useAddProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddProfileRequest) => {
      const validated = AddProfileRequestSchema.parse(item);
      const { error } = await supabase
        .from('profiles')
        .insert(validated as never);
      if (error) throw error;
      return null;
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
      const { error } = await supabase
        .from('profiles')
        .update(updates as never)
        .eq('id', id);
      if (error) throw error;
      return null;
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
