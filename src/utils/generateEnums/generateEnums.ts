import { Symbol, Project } from 'ts-morph';
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
    const values = unionTypes.map((t) => {
      const text = t.getText();
      // Remove quotes from string literal types
      if (text.startsWith('"') || text.startsWith("'")) {
        return text;
      }
      return `'${text}'`;
    });
    schemas.push(`export const ${schemaName} = z.enum([${values.join(', ')}]);`);
  } else {
    // Fallback for non-union types
    const text = enumType.getText();
    if (text.startsWith('"') || text.startsWith("'")) {
      schemas.push(`export const ${schemaName} = z.enum([${text}]);`);
    } else {
      schemas.push(`export const ${schemaName} = z.string();`);
    }
  }

  return schemas;
}

export function generateEnumTypes({ enumName }: { enumName: string }): string[] {
  const pascalName = toPascalCase(enumName);
  const typeName = pascalName;
  const schemaName = `${pascalName}Schema`;

  return [`export type ${typeName} = z.infer<typeof ${schemaName}>;`];
}
