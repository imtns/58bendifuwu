module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  globals: { wx: true },
  extends: 'airbnb-base',
  plugins: [
    'html'
  ],
  settings: {
    "import/resolver": {
      "node": {
        "extensions": [
          ".js",
          ".wpy"
        ]
      }
    },
    'html/html-extensions': ['.html', '.wpy']
  },
  'rules': {
    'linebreak-style': 0,
    'indent': [2, 4],
    'radix': ['error', 'as-needed'],
    'no-bitwise': ['error', { 'allow': ['~'] }],
    'object-shorthand': ['error', 'methods'],
    'no-unused-expressions': ["error", { "allowShortCircuit": true }],
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-console': 0,
    'space-before-function-paren': 0,
    'class-methods-use-this': 0,
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'wpy': 'never'
    }]
  }
}
