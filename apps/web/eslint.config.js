import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const ONE_MODAL =
  'There is one Modal in this project: src/components/ui/modal.tsx. Use it with props and children instead of building a second one. See CLAUDE.md, Rule 1.';

const NO_RAW_HEX =
  'Literal colour is banned outside src/styles/globals.css. Use a semantic token (bg-surface, text-muted, bg-accent, bg-owner-a…). See CLAUDE.md, Rule 2.';

const HEX_SELECTORS = [
  { selector: 'Literal[value=/\\[#[0-9a-fA-F]{3,8}\\]/]', message: NO_RAW_HEX },
  { selector: 'Literal[value=/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/]', message: NO_RAW_HEX },
];

export default tseslint.config(
  { ignores: ['dist', 'src/routeTree.gen.ts'] },

  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      'no-restricted-syntax': ['error', ...HEX_SELECTORS],
    },
  },

  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['src/components/ui/modal.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        ...HEX_SELECTORS,
        { selector: 'JSXOpeningElement[name.name="dialog"]', message: ONE_MODAL },
        { selector: 'JSXAttribute[name.name="role"][value.value="dialog"]', message: ONE_MODAL },
        { selector: 'JSXAttribute[name.name="role"][value.value="alertdialog"]', message: ONE_MODAL },
      ],
    },
  },
);
