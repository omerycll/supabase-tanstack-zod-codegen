import { singular } from 'pluralize';

interface ToZodSchemaNameArgs {
  tableName: string;
  operation: 'Get' | 'Add' | 'Update';
}

export function toZodSchemaName({ tableName, operation }: ToZodSchemaNameArgs): string {
  const pascalCaseTableName = tableName.replace(/(?:^|_|-)(\w)/g, (_, char) =>
    char.toUpperCase()
  );

  const formattedTableName = singular(pascalCaseTableName);

  if (operation === 'Get') {
    return `${formattedTableName}Schema`;
  }

  return `${operation}${formattedTableName}RequestSchema`;
}
