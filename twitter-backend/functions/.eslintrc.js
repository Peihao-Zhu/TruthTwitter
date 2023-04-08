module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: ['eslint:recommended'],
  rules: {
    // 'no-restricted-globals': ['error', 'name', 'length'],
    // 'prefer-arrow-callback': 'error',
    // quotes: ['error', 'single', { allowTemplateLiterals: true }],

    'object-curly-spacing': ['error', 'always'],
    'semi': 'off',
  },
  // overrides: [
  //   {
  //     files: ['**/*.spec.*'],
  //     env: {
  //       mocha: true,
  // },
  //     rules: {},
  //   },
  // ],
  globals: {},
}
