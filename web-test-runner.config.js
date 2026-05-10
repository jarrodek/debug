import { esbuildPlugin } from '@web/dev-server-esbuild'

export default {
  nodeResolve: true,

  files: 'test/**/*.test.ts',

  // Support TypeScript in test files
  plugins: [
    esbuildPlugin({
      ts: true,
      target: 'es2022',
      sourcemap: 'inline',
    }),
  ],

  // Test configuration
  testsStartTimeout: 30000,
  testsFinishTimeout: 60000,
  browserStartTimeout: 30000,

  testFramework: {
    config: {
      timeout: 10000,
    },
  },

  // Coverage
  coverage: true,
  coverageConfig: {
    // Instrument built JS (source maps map back to TS)
    include: ['src/**/*.ts'],
    exclude: ['dist/**/*.d.ts', 'test/**/*'],
    threshold: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },

  // Useful for debugging
  // watch: true,
  // open: true,
}
