const js = require('@eslint/js');
const globals = require('globals');
const nPlugin = require('eslint-plugin-n');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

const n = nPlugin.default || nPlugin;

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      n: n,
      prettier: prettierPlugin,
    },
    rules: {
      ...n.configs.recommended.rules,
      'prettier/prettier': 'error',
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-console': 'off',
      'n/no-unpublished-require': 'off',
      'n/no-missing-require': 'error',
      'n/no-process-exit': 'off',
      ...prettierConfig.rules,
    },
  },
  {
    ignores: ['node_modules/', 'dist/', 'prisma/'],
  },
];
