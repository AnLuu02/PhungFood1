// const config = {
//   parser: '@typescript-eslint/parser',
//   parserOptions: { project: true },
//   plugins: ['@typescript-eslint', 'prettier'],
//   extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
//   rules: {
//     '@typescript-eslint/array-type': 'off',
//     '@typescript-eslint/consistent-type-definitions': 'off',
//     '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports', fixStyle: 'inline-type-imports' }],
//     '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
//     '@typescript-eslint/require-await': 'off',
//     '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
//     '@typescript-eslint/no-empty-interface': 0,
//     '@typescript-eslint/no-unsafe-assignment': 0,
//     '@typescript-eslint/no-unsafe-call': 0,
//     '@typescript-eslint/no-unsafe-member-access': 0,
//     '@typescript-eslint/no-explicit-any': 0,
//     '@typescript-eslint/no-unsafe-return': 0,
//     '@typescript-eslint/dot-notation': 0,
//     '@typescript-eslint/prefer-nullish-coalescing': 0,
//     '@typescript-eslint/no-unsafe-argument': 0,
//     '@typescript-eslint/ban-types': 0,
//     'react/display-name': [0],
//     'prettier/prettier': [1]
//   },
//   ignorePatterns: ['prisma/**/*.cjs']
// };

// module.exports = config;

const config = {
  parser: '@typescript-eslint/parser',
  parserOptions: { project: './tsconfig.json' },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  rules: {
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports', fixStyle: 'inline-type-imports' }],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
    '@typescript-eslint/no-empty-interface': 'off',
    // '@typescript-eslint/no-explicit-any': 'warn', // Bật cảnh báo thay vì tắt hoàn toàn
    // '@typescript-eslint/no-unsafe-assignment': 'warn',
    // '@typescript-eslint/no-unsafe-call': 'warn',
    // '@typescript-eslint/no-unsafe-member-access': 'warn',
    // '@typescript-eslint/no-unsafe-return': 'warn',
    '@typescript-eslint/dot-notation': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/ban-types': 'off',
    'react/display-name': 'off',
    'prettier/prettier': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unused-expressions': 'off'
  },
  ignorePatterns: ['prisma/**/*.cjs', 'node_modules/', '.next/', 'dist/']
};

module.exports = config;
