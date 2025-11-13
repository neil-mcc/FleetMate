import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/display-name": "warn",
      "react/prop-types": "off", // TypeScript handles prop validation
    },
  },
  {
    files: ["**/*.config.js", "**/*.config.mjs"],
    languageOptions: {
      globals: {
        module: "readonly",
      },
    },
  },
  {
    ignores: [".next/**", "node_modules/**", "dist/**", "build/**"],
  },
];
