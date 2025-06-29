module.exports = {
  locales: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ar', 'hi', 'ru'],
  sourceLocale: 'en',
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}/messages',
      include: ['src'],
      exclude: ['**/node_modules/**'],
    },
  ],
  format: 'po',
  formatOptions: {
    lineNumbers: false,
  },
  orderBy: 'messageId',
  pseudoLocale: 'pseudo',
  fallbackLocales: {
    default: 'en',
  },
  runtimeConfigModule: ['@lingui/core', 'i18n'],
}