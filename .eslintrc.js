module.exports = {
  root: true,
  extends: ['universe/native', 'universe/shared/typescript-analysis'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'warn',
  },
};
