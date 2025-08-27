import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from '@eslint/eslintrc';
import unusedImports from 'eslint-plugin-unused-imports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      'unused-imports': unusedImports
    },
    settings: {
      'import/core-modules': ['server-only']
    },

    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'none'
        }
      ],

      'import/no-unresolved': 'error',
      'import/named': 'off',
      'import/no-anonymous-default-export': 'off',
      'no-console': 'warn',
      'no-multi-spaces': 'warn',
      'no-trailing-spaces': 'warn',
      'no-whitespace-before-property': 'warn',
      'no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 0 }],
      'react/jsx-indent': ['warn', 2],
      indent: ['warn', 2],
      'unused-imports/no-unused-imports': 'warn',
      'import/order': [
        'warn',
        {
          'newlines-between': 'never',
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index'
          ]
        }
      ],
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: '*', next: 'block-like' },
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'always', prev: 'block-like', next: 'block-like' }
      ],
      '@next/next/no-img-element': 'off'
    }
  }
];

export default eslintConfig;
