import { getPackages } from '@manypkg/get-packages';
import { join } from 'path';
import { PackageJson } from 'type-fest';
import { Application, NavigationItem } from 'typedoc';
import * as ts from 'typescript';

import { compilerOptions } from '../tsconfig.base.json';

function baseDir(...paths: string[]) {
  return join(__dirname, '../../', ...paths);
}

compilerOptions.lib = ['lib.esnext.full'];
delete compilerOptions.sourceMap;
delete compilerOptions.declaration;
delete compilerOptions.jsx;

const {
  lib,
  sourceMap,
  declaration,
  jsx,
  module,
  target,
  moduleResolution,
  ...options
} = compilerOptions;

/**
 * Get the input files.
 */
async function getInputFiles() {
  const inputFiles = await getPackages(baseDir());
  return inputFiles.packages
    .filter((pkg) => !!(pkg.packageJson as PackageJson).types && !pkg.packageJson.private)
    .map((pkg) => join(pkg.dir, 'src'));
}

async function createApplication() {
  const inputFiles = await getInputFiles();

  const app = new Application();
  app.bootstrap({
    plugin: ['typedoc-plugin-external-module-name', 'typedoc-plugin-markdown'],
    theme: require.resolve('docusaurus-plugin-typedoc/dist/theme'),
    inputFiles,
    ignoreCompilerErrors: true,

    // output directory relative to docs directory - use '' for docs root
    // (defaults to 'api').
    out: 'api',

    // Skip updating of sidebars.json (defaults to false).
    readme: baseDir('docs/api.md'),
    name: 'remirror',
    mode: 'modules',
    excludePrivate: true,
    excludeNotExported: true,
    excludeExternals: true,
    stripInternal: true,
    includeDeclarations: false,
    logger: 'console',

    lib: ['lib.esnext.full'],
    ...options,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.Preserve,
    exclude: [
      '**/__tests__',
      '**/__dts__',
      '**/__mocks__',
      '**/__fixtures__',
      '*.{test,spec}.{ts,tsx}',
      '**/*.d.ts',
      '*.d.ts',
    ],
  });

  const project = app.convert(app.expandInputFiles(inputFiles));
  app.generateDocs(project, baseDir('docs', 'api'));

  return app;
}

async function main() {
  await createApplication();
}

main().catch((error) => {
  console.log(`Something went wrong:`, error);
});
