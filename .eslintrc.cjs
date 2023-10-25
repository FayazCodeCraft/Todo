module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": ["standard-with-typescript",'plugin:prettier/recommended'],
    plugins: ['prettier'],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "ignorePatterns": ["vite.config.js"],
    "rules": {
        "@typescript-eslint/no-misused-promises": [
            "error",
            {
              "checksVoidReturn": false
            }
          ],
           "@typescript-eslint/strict-boolean-expressions": "off",
    }
}
