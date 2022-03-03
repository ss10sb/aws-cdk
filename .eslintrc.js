module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    extends: ['plugin:@typescript-eslint/recommended'],
    env: {
        jest: true,
        node: true,
    },
    rules: {
        'no-console': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
    },
};