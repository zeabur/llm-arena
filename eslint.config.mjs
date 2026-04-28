import nextConfig from 'eslint-config-next';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import unusedImports from 'eslint-plugin-unused-imports';

const eslintConfig = [
  ...nextConfig,
  ...nextCoreWebVitals,
  ...nextTypescript,
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

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
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
