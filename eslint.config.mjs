import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            // sourceType: "commonjs"
            sourceType: 'script',
            ecmaVersion: 'latest'
        }
    },
    {
        languageOptions:
        {
            globals: {
                ...globals.browser,
                ...globals.node,
            }
        }
    },
    pluginJs.configs.recommended,
];