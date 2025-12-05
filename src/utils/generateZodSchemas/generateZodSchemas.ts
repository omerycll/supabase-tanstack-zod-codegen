import type { Symbol, Type } from 'ts-morph';

import { toZodSchemaName } from './toZodSchemaName';

interface GenerateZodSchemasArg {
  table: Symbol;
  tableName: string;
}

function typeToZodSchema(type: Type, isOptional = false): string {
  const typeText = type.getText();

  // Handle union types (e.g., string | null)
  if (type.isUnion()) {
    const unionTypes = type.getUnionTypes();
    const hasNull = unionTypes.some((t) => t.isNull());
    const hasUndefined = unionTypes.some((t) => t.isUndefined());
    const nonNullTypes = unionTypes.filter((t) => !t.isNull() && !t.isUndefined());

    if (nonNullTypes.length === 1) {
      let schema = typeToZodSchema(nonNullTypes[0]);
      if (hasNull) schema += '.nullable()';
      if (hasUndefined || isOptional) schema += '.optional()';
      return schema;
    }
  }

  // Handle primitive types
  if (type.isString()) {
    return isOptional ? 'z.string().optional()' : 'z.string()';
  }
  if (type.isNumber()) {
    return isOptional ? 'z.number().optional()' : 'z.number()';
  }
  if (type.isBoolean()) {
    return isOptional ? 'z.boolean().optional()' : 'z.boolean()';
  }
  if (type.isNull()) {
    return 'z.null()';
  }
  if (type.isUndefined()) {
    return 'z.undefined()';
  }

  // Handle Json type
  if (typeText === 'Json' || typeText.includes('Json')) {
    return isOptional ? 'z.unknown().optional()' : 'z.unknown()';
  }

  // Handle arrays
  if (type.isArray()) {
    const elementType = type.getArrayElementType();
    if (elementType) {
      const elementSchema = typeToZodSchema(elementType);
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
