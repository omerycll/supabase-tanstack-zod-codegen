import path from 'path';

interface ImportSupabaseArgs {
  relativeSupabasePath?: string;
  supabaseExportName?: string;
  outputFilePath?: string;  // The path where the generated file will be written
}

/**
 * Calculates relative path from output file to supabase file.
 * Both paths are relative to the config file location (root).
 *
 * For example, if relativeSupabasePath is "./example/supabase" and outputFilePath is
 * "./example/generated/tables/todo_items/hooks.ts", the result should be "../../../supabase".
 */
function adjustRelativePath(
  relativePath: string,
  outputFilePath?: string
): string {
  if (!outputFilePath) {
    return relativePath;
  }

  // Normalize paths - remove leading "./"
  const normalizedSupabase = relativePath.replace(/^\.\//, '');
  const normalizedOutput = outputFilePath.replace(/^\.\//, '');

  // Get the directory of the output file
  const outputDir = path.dirname(normalizedOutput);

  // Calculate relative path from output directory to supabase file
  const relativeTo = path.relative(outputDir, normalizedSupabase);

  // Ensure it starts with "./" or "../"
  if (!relativeTo.startsWith('.')) {
    return './' + relativeTo;
  }

  return relativeTo;
}

export function importSupabase({
  relativeSupabasePath = './supabase',
  supabaseExportName,
  outputFilePath,
}: ImportSupabaseArgs): string {
  const exportName = supabaseExportName
    ? `{ ${supabaseExportName} }`
    : 'supabase';

  const adjustedPath = adjustRelativePath(relativeSupabasePath, outputFilePath);

  return `import ${exportName} from '${adjustedPath}';`;
}
