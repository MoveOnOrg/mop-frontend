module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  plugins: ['prefer-object-spread'],
  rules: {
    semi: ['error', 'never'],
    'comma-dangle': ['error', 'never'],
    'capitalized-comments': ['error', 'always', {
      ignorePattern: '.*',
      ignoreInlineComments: true
    }],
    'no-underscore-dangle': ['off'],
    'no-alert': ['off'],
    'jsx-quotes': ['error', 'prefer-single'],
    'max-len': ['off'],
    'prefer-object-spread/prefer-object-spread': 2,
    'import/no-unresolved': 'off'
  }
}
