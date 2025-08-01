import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import importPlugin from "eslint-plugin-import";
import perfectionistPlugin from "eslint-plugin-perfectionist";
import reactPlugin from "eslint-plugin-react";
import reactPerfPlugin from "eslint-plugin-react-perf";
import prettierPlugin from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      import: importPlugin,
      perfectionist: perfectionistPlugin,
      react: reactPlugin,
      prettier: prettierPlugin,
      "react-perf": reactPerfPlugin,
    },
    settings: {
      // TypeScript 경로 매핑 설정
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      // Prettier 충돌 방지
      "prettier/prettier": "error",
      
      // TypeScript
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      
      // React
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",

      // Import
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent", 
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],

      // Perfectionist
      "perfectionist/sort-imports": "off",
      "perfectionist/sort-named-imports": "off",
      "perfectionist/sort-objects": "error",
      "perfectionist/sort-jsx-props": "error",

      // React Perf
      "react-perf/jsx-no-new-array-as-prop": "error",
      "react-perf/jsx-no-new-function-as-prop": "error",
      "react-perf/jsx-no-new-object-as-prop": "error",
    },
  },
];

export default eslintConfig;
