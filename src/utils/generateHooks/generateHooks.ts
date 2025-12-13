import { toTypeName } from '../generateTypes/toTypeName';
import { toZodSchemaName } from '../generateZodSchemas/toZodSchemaName';
import { toHookName } from './toHookName';

interface GenerateHooksArg {
  tableName: string;
  supabaseExportName?: string | false;
}

// Helper function to apply filters to a Supabase query
export const applyFiltersHelper = `
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
`;

export function generateHooks({
  supabaseExportName,
  tableName,
}: GenerateHooksArg): string[] {
  const hooks: string[] = [];
  const supabase = supabaseExportName || 'supabase';

  const getRowType = toTypeName({ operation: 'Get', tableName });
  const addRowType = toTypeName({ operation: 'Add', tableName });
  const updateRowType = toTypeName({ operation: 'Update', tableName });

  const addSchema = toZodSchemaName({ operation: 'Add', tableName });
  const updateSchema = toZodSchemaName({ operation: 'Update', tableName });

  hooks.push(
    `export function ${toHookName({
      operation: 'Get',
      tableName,
    })}(id: string) {
  return useQuery<${getRowType}, Error>({
    queryKey: ['${tableName}', id],
    queryFn: async () => {
      const { data, error } = await ${supabase}
        .from('${tableName}')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as ${getRowType};
    },
    enabled: !!id
  });
}`,
    `export function ${toHookName({ operation: 'GetAll', tableName })}(options?: QueryOptions) {
  return useQuery<PaginatedResponse<${getRowType}>, Error>({
    queryKey: options?.queryKey ?? ['${tableName}', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = ${supabase}.from('${tableName}').select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, { ascending: sort.direction === 'asc' });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: (data as unknown) as ${getRowType}[],
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
}`,
    `export function ${toHookName({ operation: 'Add', tableName })}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: ${addRowType}) => {
      const result = ${addSchema}.safeParse(item);
      if (!result.success) {
        throw new Error(\`Validation failed: \${result.error.issues.map(i => \`\${i.path.join('.')}: \${i.message}\`).join(', ')}\`);
      }
      const { data, error } = await ${supabase}
        .from('${tableName}')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as ${getRowType};
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${tableName}'] });
    },
  });
}`,
    `export function ${toHookName({ operation: 'Update', tableName })}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: ${updateRowType}) => {
      const result = ${updateSchema}.safeParse(item);
      if (!result.success) {
        throw new Error(\`Validation failed: \${result.error.issues.map(i => \`\${i.path.join('.')}: \${i.message}\`).join(', ')}\`);
      }
      const { id, ...updates } = result.data;
      const { data, error } = await ${supabase}
        .from('${tableName}')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as ${getRowType};
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${tableName}'] });
    },
  });
}`,
    `export function ${toHookName({ operation: 'Delete', tableName })}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await ${supabase}
        .from('${tableName}')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${tableName}'] });
    }
  });
}`,
    // Bulk Add
    `export function ${toHookName({ operation: 'BulkAdd', tableName })}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: ${addRowType}[]) => {
      const validated: ${addRowType}[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = ${addSchema}.safeParse(items[i]);
        if (!result.success) {
          throw new Error(\`Validation failed at index \${i}: \${result.error.issues.map(issue => \`\${issue.path.join('.')}: \${issue.message}\`).join(', ')}\`);
        }
        validated.push(result.data);
      }
      const { data, error } = await ${supabase}
        .from('${tableName}')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as ${getRowType}[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${tableName}'] });
    },
  });
}`,
    // Bulk Update
    `export function ${toHookName({ operation: 'BulkUpdate', tableName })}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: ${updateRowType}[]) => {
      const results: ${getRowType}[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = ${updateSchema}.safeParse(items[i]);
        if (!result.success) {
          throw new Error(\`Validation failed at index \${i}: \${result.error.issues.map(issue => \`\${issue.path.join('.')}: \${issue.message}\`).join(', ')}\`);
        }
        const { id, ...updates } = result.data;
        const { data, error } = await ${supabase}
          .from('${tableName}')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as ${getRowType});
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${tableName}'] });
    },
  });
}`,
    // Bulk Delete
    `export function ${toHookName({ operation: 'BulkDelete', tableName })}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await ${supabase}
        .from('${tableName}')
        .delete()
        .in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${tableName}'] });
    },
  });
}`
  );

  return hooks;
}
