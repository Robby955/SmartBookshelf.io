module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "quotes": ["error", "double"],
    "object-curly-spacing": ["error", "never"],
    "no-html-link-for-pages": "off",
  },
};
