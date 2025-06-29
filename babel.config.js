module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      ['@lingui/babel-preset-react', {
        runtime: 'automatic'
      }]
    ],
    plugins: [
      'macros',
      'react-native-reanimated/plugin',
    ],
  };
};