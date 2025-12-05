import { ModuleKind, Project, ScriptTarget } from 'ts-morph';

export function getTablesProperties(typesPath: string) {
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

  let publicType;
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

  const tablesProperty = publicType
    .getApparentProperties()
    .find((property) => property.getName() === 'Tables');

  if (!tablesProperty) {
    throw new Error('No Tables property found within the Database interface.');
  }

  const tablesType = project
    .getProgram()
    .getTypeChecker()
    .getTypeAtLocation(tablesProperty.getValueDeclarationOrThrow());
  const tablesProperties = tablesType.getProperties();

  if (tablesProperties.length === 0) {
    throw new Error('No tables found within the Tables property.');
  }

  return tablesProperties;
}
