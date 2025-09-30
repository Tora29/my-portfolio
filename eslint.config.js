import js from '@eslint/js'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import jsdocPlugin from 'eslint-plugin-jsdoc'

export default [
  js.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 2023,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        document: 'readonly',
        window: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
      prettier: prettierPlugin,
      jsdoc: jsdocPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-undef': 'off', // TypeScript handles this
      // JSDoc rules
      'jsdoc/require-jsdoc': [
        'warn',
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
          },
        },
      ],
      'jsdoc/require-param': 'warn',
      'jsdoc/require-param-description': 'warn',
      'jsdoc/require-param-type': 'off', // TypeScriptで型定義するため
      'jsdoc/require-returns': 'warn',
      'jsdoc/require-returns-description': 'warn',
      'jsdoc/require-returns-type': 'off', // TypeScriptで型定義するため
      'jsdoc/check-param-names': 'error',
      'jsdoc/check-tag-names': 'error',
      'jsdoc/check-types': 'off', // TypeScriptで型チェックするため
      'jsdoc/valid-types': 'off', // TypeScriptで型チェックするため
    },
  },
  {
    ignores: ['dist/*', 'node_modules/*', '*.config.js', '*.config.ts'],
  },
]