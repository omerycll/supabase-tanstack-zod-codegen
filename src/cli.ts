#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import generate, { Config } from './generate';
import { getConfigFile } from './utils/getConfigFile/getConfigFile';

interface CliConfig extends Config {
  configPath?: string;
}

yargs(hideBin(process.argv))
  .command(
    'generate [configPath]',
    'Generate hooks, types, and zod schemas',
    (yargs) => {
      return yargs
        .positional('configPath', {
          describe: 'Path to the configuration file',
          type: 'string',
        })
        .options({
          outputPath: { type: 'string', description: 'Single file output path (legacy mode)' },
          prettierConfigPath: { type: 'string', description: 'Path to prettier config' },
          relativeSupabasePath: { type: 'string', description: 'Relative path to supabase client' },
          supabaseExportName: { type: 'string', description: 'Name of supabase export' },
          typesPath: { type: 'string', description: 'Path to supabase types file' },
        })
        .check((argv) => {
          if (!argv.configPath && !argv.typesPath) {
            throw new Error(
              'When "configPath" is not provided, "typesPath" must be provided.'
            );
          }
          return true;
        });
    },
    async (argv) => {
      const config: CliConfig = argv.configPath
        ? getConfigFile(argv.configPath)
        : (argv as CliConfig);

      await generate(config);
    }
  )
  .help()
  .alias('help', 'h')
  .strict()
  .parse();
