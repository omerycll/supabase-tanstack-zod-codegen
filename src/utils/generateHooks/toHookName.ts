import { plural, singular } from 'pluralize';

interface ToHookNameArgs {
  tableName: string;
  operation: 'GetAll' | 'Get' | 'Add' | 'Update' | 'Delete' | 'BulkAdd' | 'BulkUpdate' | 'BulkDelete';
}

export function toHookName({ tableName, operation }: ToHookNameArgs): string {
  const pascalCaseTableName = tableName.replace(/(?:^|_|-)(\w)/g, (_, char) =>
    char.toUpperCase()
  );

  // Use plural for GetAll and Bulk operations
  const usePlural = operation === 'GetAll' || operation.startsWith('Bulk');
  const entityName = usePlural
    ? plural(pascalCaseTableName)
    : singular(pascalCaseTableName);

  return `use${operation}${entityName}`;
}
