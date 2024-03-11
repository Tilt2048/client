module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "react-app",
  ],
  plugins: ["react", "prettier"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    "prettier/prettier": "error",
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
  },
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
