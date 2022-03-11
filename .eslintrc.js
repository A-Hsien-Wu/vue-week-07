module.exports = {
   root: true,
   env: {
      node: true
   },
   extends: [
      'plugin:vue/vue3-essential',
      '@vue/standard'
   ],
   parserOptions: {
      parser: '@babel/eslint-parser',
      requireConfigFile: 'false'
   },
   rules: {
      semi: ['error', 'always'],
      indent: ['error', 3],
      camelcase: 'off',
      'space-before-function-paren': ['error', 'never'],
      'comma-dangle': ['error', {
         arrays: 'only-multiline',
         objects: 'only-multiline',
      }],
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
   }
};
