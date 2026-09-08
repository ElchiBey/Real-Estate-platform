import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules', '**/*.bak'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Remaining `any`s are deliberate design gaps (form payloads, the
      // filters object, the lazily-imported aiAPI module). Kept visible as
      // warnings rather than blocking the build until those get real types.
      '@typescript-eslint/no-explicit-any': 'warn',
      // tsconfig sets noUnusedLocals/noUnusedParameters false; keep unused vars
      // as warnings and allow the conventional _-prefixed ignore.
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  // Vite config runs in Node, not the browser.
  {
    files: ['vite.config.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },
)
