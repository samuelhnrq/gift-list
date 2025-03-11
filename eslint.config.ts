import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import js from "@eslint/js";
import { jest } from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = tseslint.config([
  js.configs.recommended,
  eslintConfigPrettier,
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:@next/next/recommended",
  ),
  tseslint.configs.strict,
  {
    ignores: ["src/db/drizzle", ".next"],
  },
  {
    languageOptions: { globals: { ...jest } },
  },
]);

export default eslintConfig;
