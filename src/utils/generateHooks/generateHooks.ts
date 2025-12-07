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
    queryKey: ['${tableName}', options],
    queryFn: async () => {
      const { filters, sort, pagination } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Get total count
      let countQuery = ${supabase}.from('${tableName}').select('*', { count: 'exact', head: true });
      countQuery = applyFilters(countQuery, filters);
      const { count } = await countQuery;
      const total = count || 0;

      // Get paginated data
      let query = ${supabase}.from('${tableName}').select('*');
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, { ascending: sort.direction === 'asc' });
      }

      query = query.range(from, to);

      const { data, error } = await query;
      if (error) throw error;

      return {
        data: data as ${getRowType}[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    }
  });
}`,
    `export function ${toHookName({ operation: 'Add', tableName })}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: ${addRowType}) => {
      const validated = ${addSchema}.parse(item);
      const { error } = await ${supabase}
        .from('${tableName}')
        .insert(validated as never);
      if (error) throw error;
      return null;
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
      const { id, ...updates } = ${updateSchema}.parse(item);
      const { error } = await ${supabase}
        .from('${tableName}')
        .update(updates as never)
        .eq('id', id);
      if (error) throw error;
      return null;
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
}`
  );

  return hooks;
}
