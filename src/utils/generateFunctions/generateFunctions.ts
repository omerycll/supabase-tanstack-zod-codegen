import type { Symbol, Project, Type } from 'ts-morph';
import { toPascalCase } from '../toPascalCase/toPascalCase';

interface GenerateFunctionsArg {
  func: Symbol;
  functionName: string;
  supabaseExportName?: string;
  project: Project;
}

function isJsonType(type: Type): boolean {
  // Detect Supabase Json type: string | number | boolean | null | { [key: string]: Json } | Json[]
  // This is a recursive type that causes infinite nesting
  if (!type.isUnion()) return false;

  const unionTypes = type.getUnionTypes();
  const nonNullTypes = unionTypes.filter(
    (t) => !t.isNull() && !t.isUndefined()
  );

  // Json type typically has: string, number, boolean, object (with index signature), array
  const hasString = nonNullTypes.some((t) => t.isString());
  const hasNumber = nonNullTypes.some((t) => t.isNumber());
  const hasBoolean = nonNullTypes.some((t) => t.isBoolean());
  const hasArray = nonNullTypes.some((t) => t.isArray());
  const hasObject = nonNullTypes.some((t) => t.isObject() && !t.isArray());

  // If it has string, number, boolean plus array OR object, it's likely Json
  // More permissive check since Json can appear in different variations
  if (hasString && hasNumber && hasBoolean && (hasArray || hasObject)) {
    return true;
  }

  // Also check if we have 4+ types in the union (typical of Json)
  if (nonNullTypes.length >= 4 && hasString && hasNumber && hasBoolean) {
    return true;
  }

  return false;
}

function typeToZodSchema(
  type: Type,
  isOptional = false,
  depth = 0,
  forceNullable = false
): string {
  // Prevent infinite recursion - use a low depth since Json type recurses quickly
  if (depth > 2) {
    let schema = 'z.unknown()';
    if (forceNullable) schema += '.nullable()';
    if (isOptional) schema += '.optional()';
    return schema;
  }

  // Handle null types
  if (type.isNull()) {
    return 'z.null()';
  }

  // Handle undefined types
  if (type.isUndefined()) {
    return 'z.undefined()';
  }

  // Detect Json type early and return z.unknown() to avoid infinite recursion
  if (isJsonType(type)) {
    return isOptional
      ? 'z.unknown().nullable().optional()'
      : 'z.unknown().nullable()';
  }

  // Handle union types (e.g., string | null, number | undefined)
  if (type.isUnion()) {
    const unionTypes = type.getUnionTypes();
    const hasNull = unionTypes.some((t) => t.isNull());
    const hasUndefined = unionTypes.some((t) => t.isUndefined());
    const nonNullUndefinedTypes = unionTypes.filter(
      (t) => !t.isNull() && !t.isUndefined()
    );

    // Check if any of the non-null types is a Json-like type
    // If the inner type is also a complex union, treat it as Json
    if (
      nonNullUndefinedTypes.length === 1 &&
      isJsonType(nonNullUndefinedTypes[0])
    ) {
      let schema = 'z.unknown()';
      if (hasNull) schema += '.nullable()';
      if (hasUndefined || isOptional) schema += '.optional()';
      return schema;
    }

    // Check if it's a string literal union (enum-like)
    const stringLiterals = nonNullUndefinedTypes.filter((t) =>
      t.isStringLiteral()
    );
    if (
      stringLiterals.length > 0 &&
      stringLiterals.length === nonNullUndefinedTypes.length
    ) {
      const values = stringLiterals.map((t) => t.getLiteralValue() as string);
      let schema = `z.enum([${values.map((v) => `'${v}'`).join(', ')}])`;
      if (hasNull) schema += '.nullable()';
      if (hasUndefined || isOptional) schema += '.optional()';
      return schema;
    }

    if (nonNullUndefinedTypes.length === 1) {
      let baseSchema = typeToZodSchema(
        nonNullUndefinedTypes[0],
        false,
        depth + 1
      );
      if (hasNull) baseSchema = `${baseSchema}.nullable()`;
      if (hasUndefined || isOptional) baseSchema = `${baseSchema}.optional()`;
      return baseSchema;
    }

    // Multiple non-null/undefined types - this is likely Json, just return unknown
    if (nonNullUndefinedTypes.length > 1) {
      let schema = 'z.unknown()';
      if (hasNull) schema += '.nullable()';
      if (hasUndefined || isOptional) schema += '.optional()';
      return schema;
    }
  }

  // Handle primitive types using type checking methods (not getText)
  if (type.isString() || type.isStringLiteral()) {
    let schema = 'z.string()';
    if (forceNullable) schema += '.nullable()';
    if (isOptional) schema += '.optional()';
    return schema;
  }
  if (type.isNumber() || type.isNumberLiteral()) {
    let schema = 'z.number()';
    if (forceNullable) schema += '.nullable()';
    if (isOptional) schema += '.optional()';
    return schema;
  }
  if (type.isBoolean() || type.isBooleanLiteral()) {
    let schema = 'z.boolean()';
    if (forceNullable) schema += '.nullable()';
    if (isOptional) schema += '.optional()';
    return schema;
  }

  // Handle array types
  if (type.isArray()) {
    const elementType = type.getArrayElementType();
    if (elementType) {
      const elementSchema = typeToZodSchema(
        elementType,
        false,
        depth + 1,
        forceNullable
      );
      let schema = `z.array(${elementSchema})`;
      if (forceNullable) schema += '.nullable()';
      if (isOptional) schema += '.optional()';
      return schema;
    }
    let schema = 'z.array(z.unknown())';
    if (forceNullable) schema += '.nullable()';
    if (isOptional) schema += '.optional()';
    return schema;
  }

  // Handle object types
  if (type.isObject() && !type.isArray()) {
    const properties = type.getProperties();
    if (properties.length > 0) {
      const fields: string[] = [];
      for (const prop of properties) {
        const propName = prop.getName();
        const propType = prop.getTypeAtLocation(
          prop.getValueDeclarationOrThrow()
        );
        const propIsOptional = prop.isOptional();
        const zodType = typeToZodSchema(
          propType,
          propIsOptional,
          depth + 1,
          forceNullable
        );
        fields.push(`${propName}: ${zodType}`);
      }
      const objectSchema = `z.object({ ${fields.join(', ')} })`;
      return isOptional ? `${objectSchema}.optional()` : objectSchema;
    }
  }

  // Default fallback
  let schema = 'z.unknown()';
  if (forceNullable) schema += '.nullable()';
  if (isOptional) schema += '.optional()';
  return schema;
}

export function generateFunctionSchemas({
  func,
  functionName,
  project,
}: GenerateFunctionsArg): string[] {
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
    const argsValueDeclaration = argsProperty.getValueDeclaration();
    // Handle case where Args is 'never' (no arguments) - getValueDeclaration returns undefined
    if (!argsValueDeclaration) {
      schemas.push(`export const ${argsSchemaName} = z.object({});`);
    } else {
      const argsType = project
        .getProgram()
        .getTypeChecker()
        .getTypeAtLocation(argsValueDeclaration);

      // Check if Args type is 'never'
      if (argsType.getText() === 'never') {
        schemas.push(`export const ${argsSchemaName} = z.object({});`);
      } else {
        const properties = argsType.getProperties();
        const schemaFields: string[] = [];
        for (const prop of properties) {
          const propName = prop.getName();
          const propValueDeclaration = prop.getValueDeclaration();
          if (!propValueDeclaration) continue;
          const propType = prop.getTypeAtLocation(propValueDeclaration);
          const isOptional = prop.isOptional();
          const zodType = typeToZodSchema(propType, isOptional);
          schemaFields.push(`  ${propName}: ${zodType}`);
        }
        schemas.push(
          `export const ${argsSchemaName} = z.object({\n${schemaFields.join(
            ',\n'
          )}\n});`
        );
      }
    }
  } else {
    schemas.push(`export const ${argsSchemaName} = z.object({});`);
  }

  // Get Returns type
  // Function returns can always be null, so we always add .nullable()
  const returnsProperty = funcType.getProperty('Returns');
  if (returnsProperty) {
    const returnsValueDeclaration = returnsProperty.getValueDeclaration();
    // Handle case where Returns has no value declaration (e.g., Returns: undefined)
    if (!returnsValueDeclaration) {
      schemas.push(
        `export const ${returnsSchemaName} = z.unknown().nullable();`
      );
    } else {
      const returnsType = project
        .getProgram()
        .getTypeChecker()
        .getTypeAtLocation(returnsValueDeclaration);

      // Check if Returns type is 'undefined' or 'never'
      const returnsTypeText = returnsType.getText();
      if (returnsTypeText === 'undefined' || returnsTypeText === 'never') {
        schemas.push(
          `export const ${returnsSchemaName} = z.undefined().nullable();`
        );
      } else {
        // forceNullable = true because function return fields can be null
        const zodSchema = typeToZodSchema(returnsType, false, 0, true);
        schemas.push(
          `export const ${returnsSchemaName} = ${zodSchema}.nullable();`
        );
      }
    }
  } else {
    schemas.push(`export const ${returnsSchemaName} = z.unknown().nullable();`);
  }

  return schemas;
}

export function generateFunctionTypes({
  functionName,
}: {
  functionName: string;
}): string[] {
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

function isMutationFunction(functionName: string): boolean {
  const mutationPrefixes = [
    'add',
    'create',
    'update',
    'delete',
    'bulk_add',
    'bulk_update',
    'bulk_delete',
    'mutation',
  ];
  const lowerName = functionName.toLowerCase();
  return mutationPrefixes.some((prefix) => lowerName.startsWith(prefix));
}

export function generateFunctionHooks({
  functionName,
  supabaseExportName,
}: {
  functionName: string;
  supabaseExportName?: string;
}): string[] {
  const supabase = supabaseExportName || 'supabase';
  const pascalName = toPascalCase(functionName);
  const hookName = `use${pascalName}`;
  const argsTypeName = `${pascalName}Args`;
  const argsSchemaName = `${pascalName}ArgsSchema`;
  const returnsSchemaName = `${pascalName}ReturnsSchema`;

  const hooks: string[] = [];

  if (isMutationFunction(functionName)) {
    const returnsTypeName = `${pascalName}Returns`;
    const optionsTypeName = `${pascalName}MutationOptions`;
    // Generate useMutation hook for create/update/delete functions
    hooks.push(`interface ${optionsTypeName} extends Omit<UseMutationOptions<${returnsTypeName}, Error, ${argsTypeName}, unknown>, 'mutationFn'> {
  queryInvalidate?: string[][];
}

export function ${hookName}(
  options?: ${optionsTypeName},
) {
  const queryClient = useQueryClient();
  const { queryInvalidate, onSuccess, ...mutationOptions } = options ?? {};
  return useMutation({
    mutationFn: async (args: ${argsTypeName}) => {
      const argsResult = ${argsSchemaName}.safeParse(args);
      if (!argsResult.success) {
        throw new Error(\`Validation failed: \${argsResult.error.issues.map(i => \`\${i.path.join('.')}: \${i.message}\`).join(', ')}\`);
      }
      const { data, error } = await ${supabase}.rpc('${functionName}', argsResult.data as never);
      if (error) throw error;
      const returnsResult = ${returnsSchemaName}.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(\`Response validation failed: \${returnsResult.error.issues.map(i => \`\${i.path.join('.')}: \${i.message}\`).join(', ')}\`);
      }
      return returnsResult.data;
    },
    ...mutationOptions,
    onSuccess: (...args) => {
      if (queryInvalidate) {
        queryInvalidate.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      onSuccess?.(...args);
    },
  });
}`);
  } else {
    const returnsTypeName = `${pascalName}Returns`;
    const optionsTypeName = `${pascalName}QueryOptions`;
    // Generate useQuery hook for get/search and other functions
    hooks.push(`type ${optionsTypeName} = Omit<UseQueryOptions<${returnsTypeName}, Error>, 'queryKey' | 'queryFn'> & { queryKey?: unknown[] };

export function ${hookName}(args: ${argsTypeName}, options?: ${optionsTypeName}) {
  const { queryKey, ...queryOptions } = options ?? {};
  return useQuery({
    queryKey: queryKey ?? ['${functionName}', args],
    queryFn: async () => {
      const argsResult = ${argsSchemaName}.safeParse(args);
      if (!argsResult.success) {
        throw new Error(\`Validation failed: \${argsResult.error.issues.map(i => \`\${i.path.join('.')}: \${i.message}\`).join(', ')}\`);
      }
      const { data, error } = await ${supabase}.rpc('${functionName}', argsResult.data as never);
      if (error) throw error;
      const returnsResult = ${returnsSchemaName}.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(\`Response validation failed: \${returnsResult.error.issues.map(i => \`\${i.path.join('.')}: \${i.message}\`).join(', ')}\`);
      }
      return returnsResult.data;
    },
    ...queryOptions,
  });
}`);
  }

  return hooks;
}
