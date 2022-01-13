module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/eslint-plugin', 'simple-import-sort'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-function-return-type': 'warn', // @TODO set to error and fix
    '@typescript-eslint/explicit-module-boundary-types': 'warn', // @TODO set to error and fix
    '@typescript-eslint/no-explicit-any': 'warn', // @TODO set to error and fix
    'simple-import-sort/imports': 'error',
  },
};
