module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'es2018',
        sourceType: 'node',
    },
    extends: ['plugin:@typescript-eslint/recommended'],
    env: {
        jest: true,
        node: true,
    },
    rules: {
        'no-console': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-var-requires': 'off',
    },
};