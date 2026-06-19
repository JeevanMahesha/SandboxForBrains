// @ts-check
// @ts-ignore

const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const unusedImports = require('eslint-plugin-unused-imports');

module.exports = tseslint.config(
  {
    ignores: [
      'node_modules/',
      'dist/',
      '.angular/',
      '.env',
      '.env.local',
      '.env.production',
      'coverage/',
      '**/*.log',
      'libs/**',
    ],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsAll,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        // @ts-ignore
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      'unused-imports': unusedImports,
    },
    // @ts-ignore
    rules: {
      '@angular-eslint/component-max-inline-declarations': [
        'error',
        {
          template: 30,
          styles: 30,
          animations: 30,
        },
      ],
      '@angular-eslint/component-class-suffix': 'off',
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      // Disable the base rule as it can report incorrect errors
      '@typescript-eslint/no-unused-vars': 'off',
      // Enable unused-imports rules with auto-fix
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateAll],
    rules: {
      '@angular-eslint/template/i18n': 'off',
      '@angular-eslint/template/no-any': 'warn',
      '@angular-eslint/template/no-call-expression': 'off',
      // Spartan NG composes UI from directives + @for/@if in templates (e.g. rendering
      // select options and table rows), so templates are inherently more branch-heavy than
      // PrimeNG's input-driven components. Raise the default limit (5) accordingly.
      '@angular-eslint/template/cyclomatic-complexity': ['error', { maxComplexity: 20 }],
    },
  },
);
