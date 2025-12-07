import { Symbol, Project } from 'ts-morph';
import { toPascalCase } from '../toPascalCase/toPascalCase';

interface GenerateFunctionsArg {
  func: Symbol;
  functionName: string;
  supabaseExportName?: string;
  project: Project;
}

function typeToZodSchema(type: any, isOptional: boolean): string {
  const typeText = type.getText();

  // Handle null types
  if (typeText === 'null') {
    return 'z.null()';
  }

  // Handle union types (e.g., string | null, number | undefined)
  if (type.isUnion()) {
    const unionTypes = type.getUnionTypes();
    const hasNull = unionTypes.some((t: any) => t.getText() === 'null');
    const hasUndefined = unionTypes.some((t: any) => t.getText() === 'undefined');
    const nonNullUndefinedTypes = unionTypes.filter(
      (t: any) => t.getText() !== 'null' && t.getText() !== 'undefined'
    );

    if (nonNullUndefinedTypes.length === 1) {
      let baseSchema = typeToZodSchema(nonNullUndefinedTypes[0], false);
      if (hasNull) baseSchema = `${baseSchema}.nullable()`;
      if (hasUndefined) baseSchema = `${baseSchema}.optional()`;
      return baseSchema;
    }

    // Multiple non-null/undefined types - create a union
    const schemas = nonNullUndefinedTypes.map((t: any) => typeToZodSchema(t, false));
    let unionSchema = `z.union([${schemas.join(', ')}])`;
    if (hasNull) unionSchema = `${unionSchema}.nullable()`;
    if (hasUndefined) unionSchema = `${unionSchema}.optional()`;
    return unionSchema;
  }

  // Handle array types
  if (type.isArray()) {
    const elementType = type.getArrayElementType();
    if (elementType) {
      return `z.array(${typeToZodSchema(elementType, false)})`;
    }
    return 'z.array(z.unknown())';
  }

  // Handle object types
  if (type.isObject() && !type.isArray()) {
    const properties = type.getProperties();
    if (properties.length > 0) {
      const fields: string[] = [];
      for (const prop of properties) {
        const propName = prop.getName();
        const propType = prop.getTypeAtLocation(prop.getValueDeclarationOrThrow());
        const propIsOptional = prop.isOptional();
        const zodType = typeToZodSchema(propType, propIsOptional);
        fields.push(`${propName}: ${zodType}`);
      }
      return `z.object({ ${fields.join(', ')} })`;
    }
  }

  // Handle primitive types
  if (typeText === 'string') {
    return isOptional ? 'z.string().optional()' : 'z.string()';
  }
  if (typeText === 'number') {
    return isOptional ? 'z.number().optional()' : 'z.number()';
  }
  if (typeText === 'boolean') {
    return isOptional ? 'z.boolean().optional()' : 'z.boolean()';
  }

  // Default fallback
  return isOptional ? 'z.unknown().optional()' : 'z.unknown()';
}

export function generateFunctionSchemas({ func, functionName, project }: GenerateFunctionsArg): string[] {
  const schemas: string[] = [];
  const pascalName = toPascalCase(functionName);
  const argsSchemaName = `${pascalName}ArgsSchema`;
  const returnsSchemaName = `${pascalName}ReturnsSchema`;

  const funcType = project
    .getProgram()
    .getTypeChecker()
    .getTypeAtLocation(func.getValueDeclarationOrThrow());

  // Get Args type
  const argsProperty = funcType.getProperty('Args');
  if (argsProperty) {
    const argsType = project
      .getProgram()
      .getTypeChecker()
      .getTypeAtLocation(argsProperty.getValueDeclarationOrThrow());

    const properties = argsType.getProperties();
    const schemaFields: string[] = [];
    for (const prop of properties) {
      const propName = prop.getName();
      const propType = prop.getTypeAtLocation(prop.getValueDeclarationOrThrow());
      const isOptional = prop.isOptional();
      const zodType = typeToZodSchema(propType, isOptional);
      schemaFields.push(`  ${propName}: ${zodType}`);
    }
    schemas.push(`export const ${argsSchemaName} = z.object({\n${schemaFields.join(',\n')}\n});`);
  } else {
    schemas.push(`export const ${argsSchemaName} = z.object({});`);
  }

  // Get Returns type
  const returnsProperty = funcType.getProperty('Returns');
  if (returnsProperty) {
    const returnsType = project
      .getProgram()
      .getTypeChecker()
      .getTypeAtLocation(returnsProperty.getValueDeclarationOrThrow());

    const zodSchema = typeToZodSchema(returnsType, false);
    schemas.push(`export const ${returnsSchemaName} = ${zodSchema};`);
  } else {
    schemas.push(`export const ${returnsSchemaName} = z.unknown();`);
  }

  return schemas;
}

export function generateFunctionTypes({ functionName }: { functionName: string }): string[] {
  const pascalName = toPascalCase(functionName);
  const argsTypeName = `${pascalName}Args`;
  const returnsTypeName = `${pascalName}Returns`;
  const argsSchemaName = `${pascalName}ArgsSchema`;
  const returnsSchemaName = `${pascalName}ReturnsSchema`;

  return [
    `export type ${argsTypeName} = z.infer<typeof ${argsSchemaName}>;`,
    `export type ${returnsTypeName} = z.infer<typeof ${returnsSchemaName}>;`,
  ];
}

export function generateFunctionHooks({ functionName, supabaseExportName }: { functionName: string; supabaseExportName?: string }): string[] {
  const supabase = supabaseExportName || 'supabase';
  const pascalName = toPascalCase(functionName);
  const hookName = `use${pascalName}`;
  const argsTypeName = `${pascalName}Args`;
  const argsSchemaName = `${pascalName}ArgsSchema`;
  const returnsSchemaName = `${pascalName}ReturnsSchema`;

  const hooks: string[] = [];

  // Generate useQuery hook for RPC function
  hooks.push(`export function ${hookName}(args: ${argsTypeName}) {
  return useQuery({
    queryKey: ['${functionName}', args],
    queryFn: async () => {
      const validated = ${argsSchemaName}.parse(args);
      const { data, error } = await ${supabase}.rpc('${functionName}', validated as never);
      if (error) throw error;
      return ${returnsSchemaName}.parse(data);
    },
  });
}`);

  return hooks;
}
