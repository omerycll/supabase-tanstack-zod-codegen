import type { Symbol, Type } from 'ts-morph';

import { toZodSchemaName } from './toZodSchemaName';

interface GenerateZodSchemasArg {
  table: Symbol;
  tableName: string;
}

function isJsonType(type: Type): boolean {
  // Detect Supabase Json type: string | number | boolean | null | { [key: string]: Json } | Json[]
  // This is a recursive type that causes infinite nesting
  if (!type.isUnion()) return false;

  const unionTypes = type.getUnionTypes();
  const nonNullTypes = unionTypes.filter((t) => !t.isNull() && !t.isUndefined());

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

function typeToZodSchema(type: Type, isOptional = false, depth = 0): string {
  // Prevent infinite recursion - use a low depth since Json type recurses quickly
  if (depth > 2) {
    return isOptional ? 'z.unknown().optional()' : 'z.unknown()';
  }

  // Handle null types first
  if (type.isNull()) {
    return 'z.null()';
  }
  if (type.isUndefined()) {
    return 'z.undefined()';
  }

  // Detect Json type early and return z.unknown() to avoid infinite recursion
  if (isJsonType(type)) {
    return isOptional ? 'z.unknown().nullable().optional()' : 'z.unknown().nullable()';
  }

  // Handle union types (e.g., string | null)
  if (type.isUnion()) {
    const unionTypes = type.getUnionTypes();
    const hasNull = unionTypes.some((t) => t.isNull());
    const hasUndefined = unionTypes.some((t) => t.isUndefined());
    const nonNullTypes = unionTypes.filter((t) => !t.isNull() && !t.isUndefined());

    // Check if any of the non-null types is a Json-like type
    if (nonNullTypes.length === 1 && isJsonType(nonNullTypes[0])) {
      let schema = 'z.unknown()';
      if (hasNull) schema += '.nullable()';
      if (hasUndefined || isOptional) schema += '.optional()';
      return schema;
    }

    // Check if it's a string literal union (enum-like)
    const stringLiterals = nonNullTypes.filter((t) => t.isStringLiteral());
    if (stringLiterals.length > 0 && stringLiterals.length === nonNullTypes.length) {
      const values = stringLiterals.map((t) => t.getLiteralValue() as string);
      let schema = `z.enum([${values.map((v) => `'${v}'`).join(', ')}])`;
      if (hasNull) schema += '.nullable()';
      if (hasUndefined || isOptional) schema += '.optional()';
      return schema;
    }

    if (nonNullTypes.length === 1) {
      let schema = typeToZodSchema(nonNullTypes[0], false, depth + 1);
      if (hasNull) schema += '.nullable()';
      if (hasUndefined || isOptional) schema += '.optional()';
      return schema;
    }

    // Multiple non-null/undefined types - this is likely Json, just return unknown
    if (nonNullTypes.length > 1) {
      let schema = 'z.unknown()';
      if (hasNull) schema += '.nullable()';
      if (hasUndefined || isOptional) schema += '.optional()';
      return schema;
    }
  }

  // Handle primitive types
  if (type.isString() || type.isStringLiteral()) {
    return isOptional ? 'z.string().optional()' : 'z.string()';
  }
  if (type.isNumber() || type.isNumberLiteral()) {
    return isOptional ? 'z.number().optional()' : 'z.number()';
  }
  if (type.isBoolean() || type.isBooleanLiteral()) {
    return isOptional ? 'z.boolean().optional()' : 'z.boolean()';
  }

  // Handle arrays
  if (type.isArray()) {
    const elementType = type.getArrayElementType();
    if (elementType) {
      const elementSchema = typeToZodSchema(elementType, false, depth + 1);
      return isOptional ? `z.array(${elementSchema}).optional()` : `z.array(${elementSchema})`;
    }
  }

  // Default fallback
  return isOptional ? 'z.unknown().optional()' : 'z.unknown()';
}

function generateZodObjectFromType(type: Type, excludeFields: string[] = []): string {
  const properties = type.getProperties();
  const schemaFields: string[] = [];

  for (const prop of properties) {
    const propName = prop.getName();
    if (excludeFields.includes(propName)) continue;

    const propType = prop.getTypeAtLocation(prop.getValueDeclarationOrThrow());
    const isOptional = prop.isOptional();

    const zodType = typeToZodSchema(propType, isOptional);
    schemaFields.push(`  ${propName}: ${zodType}`);
  }

  return `z.object({\n${schemaFields.join(',\n')}\n})`;
}

export function generateZodSchemas({ tableName, table }: GenerateZodSchemasArg): string[] {
  const tableType = table.getTypeAtLocation(table.getValueDeclarationOrThrow());

  // Get Row type
  const rowProperty = tableType.getProperty('Row');
  if (!rowProperty) {
    throw new Error(`Unable to find Row property type for ${tableName}.`);
  }
  const rowType = rowProperty.getTypeAtLocation(rowProperty.getValueDeclarationOrThrow());

  // Get Insert type
  const insertProperty = tableType.getProperty('Insert');
  if (!insertProperty) {
    throw new Error(`Unable to find Insert property type for ${tableName}.`);
  }
  const insertType = insertProperty.getTypeAtLocation(insertProperty.getValueDeclarationOrThrow());

  // Get Update type
  const updateProperty = tableType.getProperty('Update');
  if (!updateProperty) {
    throw new Error(`Unable to find Update property type for ${tableName}.`);
  }
  const updateType = updateProperty.getTypeAtLocation(updateProperty.getValueDeclarationOrThrow());

  const schemas: string[] = [];

  // Row schema (Get)
  const rowSchemaName = toZodSchemaName({ operation: 'Get', tableName });
  schemas.push(`export const ${rowSchemaName} = ${generateZodObjectFromType(rowType)};`);

  // Insert schema (Add)
  const insertSchemaName = toZodSchemaName({ operation: 'Add', tableName });
  schemas.push(`export const ${insertSchemaName} = ${generateZodObjectFromType(insertType)};`);

  // Update schema (id required and separate, rest optional from Update type excluding id)
  const updateSchemaName = toZodSchemaName({ operation: 'Update', tableName });
  schemas.push(`export const ${updateSchemaName} = ${generateZodObjectFromType(updateType, ['id'])}.extend({ id: z.string() });`);

  return schemas;
}
