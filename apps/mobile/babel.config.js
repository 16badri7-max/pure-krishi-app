module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
            '@components': './components',
            '@services': './services',
            '@store': './store',
            '@constants': './constants',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
