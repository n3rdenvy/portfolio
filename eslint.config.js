import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'public']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: { react },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // Marks JSX identifiers (incl. member expressions like <motion.div>) as used
      'react/jsx-uses-vars': 'error',
      // Intentional pattern: localStorage guards use bare catch {}
      'no-empty': ['error', { allowEmptyCatch: true }],
      // Pre-existing measurement/sync patterns (carousel autoplay refs, nav
      // overlap setState-in-effect). Real signal, not deploy blockers — revisit.
      'react-hooks/refs': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  {
    // Context files export Provider + hook together by design
    files: ['src/context/**'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
])
