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

export interface OutputConfig {
  // Single file output (legacy mode)
  singleFile?: string;

  // Separate file outputs (all in one file per type)
  hooks?: string;        // Path for all hooks
  schemas?: string;      // Path for all schemas (zod + types)

  // Auto-split tables using template pattern
  // Use {{table}} placeholder for table name
  // Example: "./generated/tables/{{table}}/hooks.ts"
  tablesDir?: {
    hooks?: string;
    schemas?: string;
  };

  // Auto-split functions using template pattern
  // Use {{function}} placeholder for function name
  // Example: "./generated/functions/{{function}}.ts"
  functionsDir?: {
    hooks?: string;
    schemas?: string;
  };

  // Functions output (all functions in one file per type)
  functions?: {
    hooks?: string;
    schemas?: string;
  };

  // Enums output
  enums?: {
    schemas?: string;
  };
}

export interface Config {
  outputPath?: string;   // Legacy: single file output
  output?: OutputConfig; // New: flexible output configuration
  prettierConfigPath?: string;
  relativeSupabasePath?: string;
  supabaseExportName?: string;
  typesPath: string;
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
`;

function validateOutputPath(outputPath: string, allowedOutputDir: string): string {
  const resolvedPath = path.resolve(allowedOutputDir, outputPath);
  if (!resolvedPath.startsWith(allowedOutputDir)) {
    throw new Error(
      `Invalid output path: "${outputPath}". Writing files outside of the allowed directory is not allowed.`
    );
  }
  return resolvedPath;
}

function ensureDirectoryExists(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

interface FileContent {
  path: string;
  content: string;
}

interface GeneratedContent {
  // Per-table content
  tables: {
    [tableName: string]: {
      hooks: string[];
      schemas: string[]; // zod + types combined
    };
  };
  // Per-function content
  functions: {
    [functionName: string]: {
      hooks: string[];
      schemas: string[]; // zod + types combined
    };
  };
  // Enums content
  enums: {
    schemas: string[]; // zod + types combined
  };
}

export default async function generate(config: Config) {
  const {
    outputPath,
    output,
    prettierConfigPath,
    relativeSupabasePath,
    supabaseExportName,
    typesPath,
  } = config;

  const allowedOutputDir = path.resolve(process.cwd());
  const { tables, functions, enums, project } = getDatabaseProperties(typesPath);

  // Collect all generated content
  const generated: GeneratedContent = {
    tables: {},
    functions: {},
    enums: { schemas: [] },
  };

  // Generate Enum schemas and types (combined into schemas)
  for (const enumSymbol of enums) {
    const enumName = enumSymbol.getName();
    const zodSchemas = generateEnumSchemas({ enumSymbol, enumName, project });
    const types = generateEnumTypes({ enumName });
    generated.enums.schemas.push(...zodSchemas, ...types);
  }

  // Generate Table schemas, types and hooks
  for (const table of tables) {
    const tableName = table.getName();
    const zodSchemas = generateZodSchemas({ table, tableName });
    const types = generateTypes({ tableName });
    generated.tables[tableName] = {
      hooks: generateHooks({ supabaseExportName, tableName }),
      schemas: [...zodSchemas, ...types],
    };
  }

  // Generate Function schemas, types and hooks
  for (const func of functions) {
    const functionName = func.getName();
    const zodSchemas = generateFunctionSchemas({ func, functionName, project, supabaseExportName });
    const types = generateFunctionTypes({ functionName });
    generated.functions[functionName] = {
      schemas: [...zodSchemas, ...types],
      hooks: generateFunctionHooks({ functionName, supabaseExportName }),
    };
  }

  // Helper to create imports
  const createZodImports = () => `import { z } from 'zod';`;
  const createReactQueryImports = () => `import { useMutation, useQuery, useQueryClient, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';`;

  const createSupabaseImport = (outputFilePath?: string) => importSupabase({
    relativeSupabasePath,
    supabaseExportName,
    outputFilePath,
  });

  // Collect all files to write
  const filesToWrite: FileContent[] = [];

  // Determine output mode
  if (outputPath || output?.singleFile) {
    // Legacy mode: single file output
    const singleOutputPath = outputPath || output?.singleFile;
    if (!singleOutputPath) {
      throw new Error('Either outputPath or output.singleFile must be provided');
    }

    const allSchemas = [
      ...generated.enums.schemas,
      ...Object.values(generated.tables).flatMap(t => t.schemas),
      ...Object.values(generated.functions).flatMap(f => f.schemas),
    ];
    const allHooks = [
      ...Object.values(generated.tables).flatMap(t => t.hooks),
      ...Object.values(generated.functions).flatMap(f => f.hooks),
    ];

    const resolvedPath = validateOutputPath(singleOutputPath, allowedOutputDir);
    const content = `
${createReactQueryImports()}
${createZodImports()}
${createSupabaseImport(singleOutputPath)}

${globalSchemas}

${applyFiltersHelper}

${allSchemas.join('\n\n')}

${allHooks.join('\n\n')}
`;

    filesToWrite.push({
      path: resolvedPath,
      content,
    });
  } else if (output) {
    // New mode: separate file outputs

    // Collect content for separate files
    const separateSchemas: string[] = [];
    const separateHooks: string[] = [];

    // Process enums
    if (output.enums?.schemas) {
      const content = `
${createZodImports()}

${generated.enums.schemas.join('\n\n')}
`;
      filesToWrite.push({
        path: validateOutputPath(output.enums.schemas, allowedOutputDir),
        content,
      });
    } else {
      separateSchemas.push(...generated.enums.schemas);
    }

    // Helper to replace template placeholders
    const applyTemplate = (template: string, replacements: Record<string, string>): string => {
      let result = template;
      for (const [key, value] of Object.entries(replacements)) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }
      return result;
    };

    // Process tables
    for (const [tableName, tableContent] of Object.entries(generated.tables)) {
      const hasTablesDir = output.tablesDir?.schemas || output.tablesDir?.hooks;

      if (hasTablesDir && output.tablesDir?.schemas) {
        const content = `
${createZodImports()}

${tableContent.schemas.join('\n\n')}
`;
        filesToWrite.push({
          path: validateOutputPath(applyTemplate(output.tablesDir.schemas, { table: tableName }), allowedOutputDir),
          content,
        });
      } else if (!hasTablesDir) {
        separateSchemas.push(...tableContent.schemas);
      }

      if (hasTablesDir && output.tablesDir?.hooks) {
        const hooksPath = applyTemplate(output.tablesDir.hooks, { table: tableName });
        const content = `
${createReactQueryImports()}
${createZodImports()}
${createSupabaseImport(hooksPath)}

${globalSchemas}

${applyFiltersHelper}

${tableContent.schemas.join('\n\n')}

${tableContent.hooks.join('\n\n')}
`;
        filesToWrite.push({
          path: validateOutputPath(hooksPath, allowedOutputDir),
          content,
        });
      } else if (!hasTablesDir) {
        separateHooks.push(...tableContent.hooks);
      }
    }

    // Process functions
    const hasFunctionsDir = output.functionsDir?.schemas || output.functionsDir?.hooks;
    const allFunctionsSchemas = Object.values(generated.functions).flatMap(f => f.schemas);
    const allFunctionsHooks = Object.values(generated.functions).flatMap(f => f.hooks);

    if (hasFunctionsDir) {
      // Per-function file output
      for (const [functionName, funcContent] of Object.entries(generated.functions)) {
        if (output.functionsDir?.schemas) {
          const content = `
${createZodImports()}

${funcContent.schemas.join('\n\n')}
`;
          filesToWrite.push({
            path: validateOutputPath(applyTemplate(output.functionsDir.schemas, { function: functionName }), allowedOutputDir),
            content,
          });
        }

        if (output.functionsDir?.hooks) {
          const hooksPath = applyTemplate(output.functionsDir.hooks, { function: functionName });
          const content = `
${createReactQueryImports()}
${createZodImports()}
${createSupabaseImport(hooksPath)}

${globalSchemas}

${applyFiltersHelper}

${funcContent.schemas.join('\n\n')}

${funcContent.hooks.join('\n\n')}
`;
          filesToWrite.push({
            path: validateOutputPath(hooksPath, allowedOutputDir),
            content,
          });
        }
      }
    } else if (output.functions?.schemas || output.functions?.hooks) {
      // All functions in single files per type
      if (output.functions?.schemas) {
        const content = `
${createZodImports()}

${allFunctionsSchemas.join('\n\n')}
`;
        filesToWrite.push({
          path: validateOutputPath(output.functions.schemas, allowedOutputDir),
          content,
        });
      } else {
        separateSchemas.push(...allFunctionsSchemas);
      }

      if (output.functions?.hooks) {
        const hooksPath = output.functions.hooks;
        const content = `
${createReactQueryImports()}
${createZodImports()}
${createSupabaseImport(hooksPath)}

${globalSchemas}

${applyFiltersHelper}

${allFunctionsSchemas.join('\n\n')}

${allFunctionsHooks.join('\n\n')}
`;
        filesToWrite.push({
          path: validateOutputPath(hooksPath, allowedOutputDir),
          content,
        });
      } else {
        separateHooks.push(...allFunctionsHooks);
      }
    } else {
      // Add to separate collections
      separateSchemas.push(...allFunctionsSchemas);
      separateHooks.push(...allFunctionsHooks);
    }

    // Write remaining content to global files
    if (output.schemas && separateSchemas.length > 0) {
      const content = `
${createZodImports()}

${globalSchemas}

${separateSchemas.join('\n\n')}
`;
      filesToWrite.push({
        path: validateOutputPath(output.schemas, allowedOutputDir),
        content,
      });
    }

    if (output.hooks && separateHooks.length > 0) {
      const hooksPath = output.hooks;
      const content = `
${createReactQueryImports()}
${createZodImports()}
${createSupabaseImport(hooksPath)}

${globalSchemas}

${applyFiltersHelper}

${separateHooks.join('\n\n')}
`;
      filesToWrite.push({
        path: validateOutputPath(hooksPath, allowedOutputDir),
        content,
      });
    }
  } else {
    throw new Error('Either outputPath or output configuration must be provided');
  }

  // Format and write all files
  for (const file of filesToWrite) {
    const formattedContent = await formatGeneratedContent({
      generatedFileContent: file.content,
      prettierConfigPath,
    });
    ensureDirectoryExists(file.path);
    fs.writeFileSync(file.path, formattedContent);
    console.log(`Generated: ${file.path}`);
  }
}
