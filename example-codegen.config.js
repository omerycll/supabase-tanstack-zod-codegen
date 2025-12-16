module.exports = {
  prettierConfigPath: '.prettierrc',
  relativeSupabasePath: './example/supabase',
  supabaseExportName: 'supabase',
  typesPath: './example/database.types.ts',
  output: {
    common: './example/generated/common.ts',
    tablesDir: {
      hooks: './example/generated/tables/{{table}}/hooks.ts',
      schemas: './example/generated/tables/{{table}}/schemas.ts',
    },
    functionsDir: {
      hooks: './example/generated/functions/{{function}}/hooks.ts',
      schemas: './example/generated/functions/{{function}}/schemas.ts',
    },
    enums: {
      schemas: './example/generated/enums/schemas.ts',
    },
  },
};
