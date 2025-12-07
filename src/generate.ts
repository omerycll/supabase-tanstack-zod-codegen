import fs from 'fs';
import path from 'path';

import { getDatabaseProperties } from './utils/getTablesProperties/getTablesProperties';
import { generateTypes } from './utils/generateTypes/generateTypes';
import { generateHooks, applyFiltersHelper } from './utils/generateHooks/generateHooks';
import { generateZodSchemas } from './utils/generateZodSchemas/generateZodSchemas';
import { generateFunctionSchemas, generateFunctionTypes, generateFunctionHooks } from './utils/generateFunctions/generateFunctions';
import { generateEnumSchemas, generateEnumTypes } from './utils/generateEnums/generateEnums';
import { formatGeneratedContent } from './utils/formatGeneratedContent/formatGeneratedContent';
import { importSupabase } from './utils/importSupabase/importSupabase';

export interface Config {
  outputPath: string;
  prettierConfigPath?: string;
  relativeSupabasePath?: string;
  supabaseExportName?: string;
  typesPath: string;
}

export default async function generate({
  outputPath,
  prettierConfigPath,
  relativeSupabasePath,
  supabaseExportName,
  typesPath,
}: Config) {
  const allowedOutputDir = path.resolve(process.cwd());
  const resolvedOutputPath = path.resolve(allowedOutputDir, outputPath);
  if (!resolvedOutputPath.startsWith(allowedOutputDir)) {
    throw new Error(
      `Invalid output path: "${outputPath}". Writing files outside of the allowed directory is not allowed.`
    );
  }

  const { tables, functions, enums, project } = getDatabaseProperties(typesPath);

  const hooks: string[] = [];
  const types: string[] = [];
  const zodSchemas: string[] = [];

  // Generate Enum schemas and types first (they might be used by tables/functions)
  for (const enumSymbol of enums) {
    const enumName = enumSymbol.getName();
    zodSchemas.push(...generateEnumSchemas({ enumSymbol, enumName, project }));
    types.push(...generateEnumTypes({ enumName }));
  }

  // Generate Table schemas, types and hooks
  for (const table of tables) {
    const tableName = table.getName();
    zodSchemas.push(...generateZodSchemas({ table, tableName }));
    types.push(...generateTypes({ tableName }));
    hooks.push(...generateHooks({ supabaseExportName, tableName }));
  }

  // Generate Function schemas, types and hooks
  for (const func of functions) {
    const functionName = func.getName();
    zodSchemas.push(...generateFunctionSchemas({ func, functionName, project, supabaseExportName }));
    types.push(...generateFunctionTypes({ functionName }));
    hooks.push(...generateFunctionHooks({ functionName, supabaseExportName }));
  }

  // Global filter and pagination schemas
  const globalSchemas = `
// Filter operators
export const FilterOperatorSchema = z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike', 'is', 'in']);
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
`;

  // Create the output file content with imports and hooks
  const generatedFileContent = `
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
${importSupabase({ relativeSupabasePath, supabaseExportName })}

${globalSchemas}

${applyFiltersHelper}

${zodSchemas.join('\n\n')}

${types.join('\n')}

${hooks.join('\n\n')}
`;

  const formattedFileContent = await formatGeneratedContent({
    generatedFileContent,
    prettierConfigPath,
  });

  // Write the output file
  fs.writeFileSync(resolvedOutputPath, formattedFileContent);
}
