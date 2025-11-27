const typescriptEslintParser = require("@typescript-eslint/parser"); // Correct import for TypeScript parser
const typescriptEslintPlugin = require("@typescript-eslint/eslint-plugin"); // Correct import for TypeScript plugin
const angularEslintPlugin = require("@angular-eslint/eslint-plugin");
const angularEslintTemplate = require("@angular-eslint/eslint-plugin-template"); // Correct import for Angular template
const angularEslintTemplateParser = require("@angular-eslint/template-parser"); // Correct import for Angular template parser


module.exports = [
  // Lint TypeScript files only in Angular project directories
  {
    files: ["src/app/**/*.ts", "src/app/**/*.html"], // Target Angular component/service files
    ignores: ["node_modules", "dist", ".angular/cache/**"], // Ignore non-source directories
    languageOptions: {
      parser: typescriptEslintParser, // Use TypeScript parser object here
      parserOptions: {
        project: "tsconfig.json", // Point to TypeScript config
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
      "@angular-eslint": angularEslintPlugin,
    },
    rules: {
      // Add Angular-specific or TypeScript-specific rules here
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: "app", style: "kebab-case" },
      ],
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "app", style: "camelCase" },
      ],
      "@typescript-eslint/no-unused-vars": "warn", // Catch unused variables in TypeScript
      // "@typescript-eslint/no-explicit-any": "warn", // Discourage use of the 'any' type
      "@typescript-eslint/no-shadow": "warn", // Warn when variables shadow outer scope variables
      "no-debugger": "error", // Disallow debugger statements
      eqeqeq: ["error", "always"], // Enforce strict equality
    },
  },
  // Add Angular template linting
  {
    files: ["src/app/**/*.html"], // Target only Angular HTML templates
    languageOptions: {
      parser: angularEslintTemplateParser, // Use Angular template parser object here
    },
    plugins: {
      "@angular-eslint/template": angularEslintTemplate, // Correctly import the Angular ESLint template plugin
    },
    rules: {
      // "@angular-eslint/template/no-any": "warn", // Warn about any type usage in templates
      "@angular-eslint/template/eqeqeq": "error", // Enforce strict equality in templates
      "@angular-eslint/template/no-negated-async": "error", // Disallow negated async pipe usage
    },
  },
];
