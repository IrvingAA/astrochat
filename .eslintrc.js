module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js', 'migrate-mongo-config.js'],
  rules: {
    'no-inline-comments': 'error',
    'spaced-comment': ['error', 'always', { line: { markers: ['/'] } }],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'LineComment',
        message:
          'No se permiten comentarios de una sola línea. Use comentarios de bloque.'
      }
    ],
    'multiline-comment-style': ['error', 'starred-block'],
    'prettier/prettier': 'error',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': [
      'error',
      {
        semi: false,
        singleQuote: true,
        trailingComma: 'none'
      }
    ]
  }
}
