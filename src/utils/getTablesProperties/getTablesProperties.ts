import { ModuleKind, Project, ScriptTarget, Symbol, Type } from 'ts-morph';

export interface DatabaseProperties {
  tables: Symbol[];
  functions: Symbol[];
  enums: Symbol[];
  project: Project;
}

export function getDatabaseProperties(typesPath: string): DatabaseProperties {
  const project = new Project({
    compilerOptions: {
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      module: ModuleKind.ESNext,
      target: ScriptTarget.ESNext,
      strictNullChecks: true,
    },
  });

  const sourceFile = project.addSourceFileAtPath(typesPath);

  // Find the 'Database' - can be either interface or type alias
  const databaseInterface = sourceFile.getInterface('Database');
  const databaseTypeAlias = sourceFile.getTypeAlias('Database');

  if (!databaseInterface && !databaseTypeAlias) {
    throw new Error('No Database interface or type alias found in the types file.');
  }

  let publicType: Type;
  if (databaseInterface) {
    const publicProperty = databaseInterface.getPropertyOrThrow('public');
    publicType = publicProperty.getType();
  } else {
    // Handle type alias
    const databaseType = databaseTypeAlias!.getType();
    const publicProperty = databaseType
      .getApparentProperties()
      .find((prop) => prop.getName() === 'public');
    if (!publicProperty) {
      throw new Error('No public property found within the Database type.');
    }
    publicType = project
      .getProgram()
      .getTypeChecker()
      .getTypeAtLocation(publicProperty.getValueDeclarationOrThrow());
  }

  const typeChecker = project.getProgram().getTypeChecker();

  // Get Tables
  const tablesProperty = publicType
    .getApparentProperties()
    .find((property) => property.getName() === 'Tables');

  let tables: Symbol[] = [];
  if (tablesProperty) {
    const tablesType = typeChecker.getTypeAtLocation(tablesProperty.getValueDeclarationOrThrow());
    tables = tablesType.getProperties();
  }

  // Get Functions
  const functionsProperty = publicType
    .getApparentProperties()
    .find((property) => property.getName() === 'Functions');

  let functions: Symbol[] = [];
  if (functionsProperty) {
    const functionsType = typeChecker.getTypeAtLocation(functionsProperty.getValueDeclarationOrThrow());
    const functionsProperties = functionsType.getProperties();
    // Filter out empty [_ in never]: never entries
    functions = functionsProperties.filter((prop) => !prop.getName().startsWith('_'));
  }

  // Get Enums
  const enumsProperty = publicType
    .getApparentProperties()
    .find((property) => property.getName() === 'Enums');

  let enums: Symbol[] = [];
  if (enumsProperty) {
    const enumsType = typeChecker.getTypeAtLocation(enumsProperty.getValueDeclarationOrThrow());
    const enumsProperties = enumsType.getProperties();
    // Filter out empty [_ in never]: never entries
    enums = enumsProperties.filter((prop) => !prop.getName().startsWith('_'));
  }

  return { tables, functions, enums, project };
}

// Backward compatibility
export function getTablesProperties(typesPath: string) {
  const { tables } = getDatabaseProperties(typesPath);
  if (tables.length === 0) {
    throw new Error('No tables found within the Tables property.');
  }
  return tables;
}
