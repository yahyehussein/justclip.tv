// module.exports = {
//   env: {
//     browser: true,
//     es2021: true,
//   },
//   extends: ["plugin:react/recommended", "standard", "prettier"],
//   parserOptions: {
//     ecmaFeatures: {
//       jsx: true,
//     },
//     ecmaVersion: 12,
//     sourceType: "module",
//   },
// };

// module.exports = {
//   root: true,
//   env: {
//     browser: true,
//     es2021: true,
//   },
//   parser: "@typescript-eslint/parser",
//   plugins: ["@typescript-eslint", "react", "prettier"],
//   extends: [
//     "plugin:@typescript-eslint/recommended",
//     "plugin:react/recommended",
//   ],
//   parserOptions: {
//     ecmaFeatures: {
//       jsx: true,
//     },
//     ecmaVersion: 12,
//     sourceType: "module",
//   },
//   settings: {
//     react: {
//       version: "detect",
//     },
//   },
//   rules: {
//     "no-use-before-define": "off",
//     "@typescript-eslint/no-use-before-define": ["error"],
//     "prettier/prettier": "error",
//   },
// };

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "react-hooks"],
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/prop-types": "off",
    "no-console": "warn",
  },
  settings: {
    react: {
      pragma: "React",
      version: "detect",
    },
  },
};
