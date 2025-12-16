interface ImportSupabaseArgs {
  relativeSupabasePath?: string;
  supabaseExportName?: string;
  outputFilePath?: string;  // The path where the generated file will be written
}

/**
 * Adjusts a relative path based on the depth of the output file.
 * The relativeSupabasePath is relative to the config file location (root).
 * We need to adjust it based on how deep the output file is.
 *
 * For example, if relativeSupabasePath is "./supabase" and outputFilePath is
 * "./generated/tables/todo_items/hooks.ts", we need to go up 3 directories
 * to get back to root, so the result is "../../../supabase".
 */
function adjustRelativePath(
  relativePath: string,
  outputFilePath?: string
): string {
  if (!outputFilePath) {
    return relativePath;
  }

  // Count how many directories deep the output file is
  // "./generated/tables/todo_items/hooks.ts" -> ["generated", "tables", "todo_items", "hooks.ts"]
  // We need to go up (count - 1) times to get to root (excluding the filename)
  const parts = outputFilePath.split('/').filter(p => p && p !== '.');
  const depth = parts.length - 1; // -1 for the filename

  if (depth <= 0) {
    return relativePath;
  }

  // Add "../" for each level to go back to root
  const prefix = '../'.repeat(depth);

  // If relativePath starts with "./", remove it before adding prefix
  if (relativePath.startsWith('./')) {
    return prefix + relativePath.slice(2);
  }

  return prefix + relativePath;
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
