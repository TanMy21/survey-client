import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import queryPlugin from "@tanstack/eslint-plugin-query";

export default [
  globalIgnores(["dist", "node_modules", "vite.config.ts"]),

  ...tseslint.config({
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.app.json",
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off", // optional
      "@typescript-eslint/ban-ts-comment": "warn",

      "no-console": "warn",
      "no-debugger": "warn",

      "prettier/prettier": "warn",

      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",

      "@tanstack/query/no-rest-deps": "warn",
      "@tanstack/query/no-missing-query-key": "error",

      "consistent-return": "warn",
      eqeqeq: ["warn", "always"],
    },
  }),

  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "simple-import-sort": simpleImportSort,
      "@tanstack/query": queryPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...reactHooks.configs["recommended"].rules,
      ...reactRefresh.configs.vite.rules,
      ...queryPlugin.configs.recommended.rules,
    },
  },

  js.configs.recommended,

  prettier,
];
