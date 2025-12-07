import type { Symbol, Project } from 'ts-morph';
import { toPascalCase } from '../toPascalCase/toPascalCase';

interface GenerateEnumsArg {
  enumSymbol: Symbol;
  enumName: string;
  project: Project;
}

export function generateEnumSchemas({ enumSymbol, enumName, project }: GenerateEnumsArg): string[] {
  const schemas: string[] = [];
  const pascalName = toPascalCase(enumName);
  const schemaName = `${pascalName}Schema`;

  const enumType = project
    .getProgram()
    .getTypeChecker()
    .getTypeAtLocation(enumSymbol.getValueDeclarationOrThrow());

  // Get union type values (e.g., 'pending' | 'in_progress' | 'completed')
  if (enumType.isUnion()) {
    const unionTypes = enumType.getUnionTypes();
    const values: string[] = [];

    for (const t of unionTypes) {
      // Use safe methods to extract string literal values
      if (t.isStringLiteral()) {
        const value = t.getLiteralValue() as string;
        values.push(`'${value}'`);
      }
    }

    if (values.length > 0) {
      schemas.push(`export const ${schemaName} = z.enum([${values.join(', ')}]);`);
    } else {
      // Fallback if no string literals found
      schemas.push(`export const ${schemaName} = z.string();`);
    }
  } else if (enumType.isStringLiteral()) {
    // Single string literal
    const value = enumType.getLiteralValue() as string;
    schemas.push(`export const ${schemaName} = z.enum(['${value}']);`);
  } else {
    // Fallback for non-union, non-string types
    schemas.push(`export const ${schemaName} = z.string();`);
  }

  return schemas;
}

export function generateEnumTypes({ enumName }: { enumName: string }): string[] {
  const pascalName = toPascalCase(enumName);
  const typeName = pascalName;
  const schemaName = `${pascalName}Schema`;

  return [`export type ${typeName} = z.infer<typeof ${schemaName}>;`];
}
