import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Rules that keep the project's principles from depending on discipline (see CLAUDE.md).
 */
const ONLY_ONE_MODAL =
  'Modal chrome may only be drawn in src/components/modal/. Put the content in src/modals/ and register it in modal-registry.ts — ModalShell already provides overlay, focus and dismissal. See CLAUDE.md, Rule 1.';

const NO_RAW_HEX =
  'Literal colour is banned outside src/styles/globals.css. Use a semantic token (bg-surface, text-muted, bg-accent, bg-owner-a…). See CLAUDE.md, Rule 2.';

const NO_DIRECT_API =
  'Components do not talk to src/api/ directly. Go through a hook in src/hooks/ (TanStack Query). See CLAUDE.md, Rule 3.';

export default tseslint.config(
  { ignores: ['dist', 'src/routeTree.gen.ts'] },

  {
    extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/\\[#[0-9a-fA-F]{3,8}\\]/]',
          message: NO_RAW_HEX,
        },
        {
          selector: 'Literal[value=/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/]',
          message: NO_RAW_HEX,
        },
      ],
    },
  },

  // Nothing outside components/modal/ may draw a modal.
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['src/components/modal/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react-dom', importNames: ['createPortal'], message: ONLY_ONE_MODAL },
            { name: '@/api', message: NO_DIRECT_API },
          ],
          patterns: [{ group: ['@/api/*', '**/api/*'], message: NO_DIRECT_API }],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/\\[#[0-9a-fA-F]{3,8}\\]/]',
          message: NO_RAW_HEX,
        },
        {
          selector: 'Literal[value=/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/]',
          message: NO_RAW_HEX,
        },
        { selector: 'JSXOpeningElement[name.name="dialog"]', message: ONLY_ONE_MODAL },
        {
          selector: 'JSXAttribute[name.name="role"][value.value="dialog"]',
          message: ONLY_ONE_MODAL,
        },
        {
          selector: 'JSXAttribute[name.name="role"][value.value="alertdialog"]',
          message: ONLY_ONE_MODAL,
        },
      ],
    },
  },

  // The data layer and the hooks are, obviously, allowed to reach src/api/.
  {
    files: ['src/api/**', 'src/hooks/**'],
    rules: { 'no-restricted-imports': 'off' },
  },
);
