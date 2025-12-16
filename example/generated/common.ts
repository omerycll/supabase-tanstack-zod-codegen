import { z } from 'zod';

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

export function applyFilters<T>(query: T, filters?: FilterCondition[]): T {
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
