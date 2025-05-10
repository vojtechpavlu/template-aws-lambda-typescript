import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import jsdoc from 'eslint-plugin-jsdoc';
import * as depend from 'eslint-plugin-depend';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import pluginPromise from 'eslint-plugin-promise';
import pluginJest from 'eslint-plugin-jest';

export default [
  // Ignore all JavaScript files globally
  { ignores: ['**/*.js', '**/*.cjs'] },

  // Include TypeScript files only
  { files: ['**/*.ts'] },
  { languageOptions: { globals: globals.browser } },

  // Ignore all JavaScript files
  { ignores: ['*.js'] },

  // Check JSDocs
  {
    plugins: { jsdoc },
    rules: {
      'jsdoc/check-access': 'error',
      'jsdoc/check-alignment': 'error',
      'jsdoc/check-param-names': 'error',
      'jsdoc/check-property-names': 'error',
      'jsdoc/check-tag-names': 'error',
      'jsdoc/check-types': 'error',
      'jsdoc/check-values': 'error',
      'jsdoc/empty-tags': 'error',
      'jsdoc/implements-on-classes': 'error',
      'jsdoc/multiline-blocks': 'error',
      'jsdoc/no-multi-asterisks': 'error',
      'jsdoc/no-undefined-types': 'error',
      'jsdoc/require-jsdoc': 'error',
      'jsdoc/require-param': 'error',
      'jsdoc/require-param-description': 'error',
      'jsdoc/require-param-name': 'error',
      'jsdoc/require-param-type': 'error',
      'jsdoc/require-property': 'error',
      'jsdoc/require-property-description': 'error',
      'jsdoc/require-property-name': 'error',
      'jsdoc/require-property-type': 'error',
      'jsdoc/require-returns': 'error',
      'jsdoc/require-returns-check': 'error',
      'jsdoc/require-returns-description': 'error',
      'jsdoc/require-returns-type': 'error',
      'jsdoc/require-yields': 'error',
      'jsdoc/require-yields-check': 'error',
      'jsdoc/valid-types': 'error',
    },
  },

  // Handling promises
  pluginPromise.configs['flat/recommended'],

  // Use Unicorn plugin with a ton of cool rules
  eslintPluginUnicorn.configs['flat/all'],

  // Verify all the dependency tree within a project
  depend.configs['flat/recommended'],

  // Use recommended settings for TypeScript
  pluginJs.configs.recommended,
  ...tseslint.configs.strict,

  {
    settings: {
      jest: {
        version: 27,
      },
    },
  },

  // Use recommended settings for Jest
  pluginJest.configs['flat/style'],
];
