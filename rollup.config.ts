import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

import type { RollupOptions } from 'rollup';

const devConfig: RollupOptions = {
  input: 'src/index.ts',
  output: {
    compact: false,
    exports: 'default',
    file: 'build/index.js',
    format: 'cjs',
    minifyInternalExports: false,
    name: 'MigascTemplate',
    sourcemap: true,
    strict: true,
  },
  plugins: [esbuild()],
};

const commonOutputOptions: RollupOptions['output'] = {
  compact: true,
  exports: 'default',
  minifyInternalExports: true,
  name: 'MigascTemplate',
  sourcemap: false,
  strict: true,
};

const prodConfig: RollupOptions[] = [
  {
    input: 'src/index.ts',
    output: [
      {
        ...commonOutputOptions,
        ...{
          file: 'dist/cjs/index.js',
          format: 'cjs',
        },
      },
      {
        ...commonOutputOptions,
        ...{
          file: 'dist/esm/index.js',
          format: 'esm',
        },
      },
      {
        ...commonOutputOptions,
        ...{
          file: 'dist/web/index.js',
          format: 'iife',
          esModule: false,
        },
      },
    ],
    plugins: [
      esbuild({
        minify: true,
        sourceMap: false,
      }),
    ],
  },
  {
    input: 'types/index.d.ts',
    output: {
      file: 'dist/index.d.ts',
    },
    plugins: [dts()],
  },
];

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
