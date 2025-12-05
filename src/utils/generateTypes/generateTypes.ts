import { toTypeName } from './toTypeName';
import { toZodSchemaName } from '../generateZodSchemas/toZodSchemaName';

interface GenerateTypesArg {
  tableName: string;
}

export function generateTypes({ tableName }: GenerateTypesArg): string[] {
  const types: string[] = [];

  const getTypeName = toTypeName({ operation: 'Get', tableName });
  const addTypeName = toTypeName({ operation: 'Add', tableName });
  const updateTypeName = toTypeName({ operation: 'Update', tableName });

  const getSchemaName = toZodSchemaName({ operation: 'Get', tableName });
  const addSchemaName = toZodSchemaName({ operation: 'Add', tableName });
  const updateSchemaName = toZodSchemaName({ operation: 'Update', tableName });

  types.push(
    `export type ${getTypeName} = z.infer<typeof ${getSchemaName}>;`,
    `export type ${addTypeName} = z.infer<typeof ${addSchemaName}>;`,
    `export type ${updateTypeName} = z.infer<typeof ${updateSchemaName}>;`
  );

  return types;
}
