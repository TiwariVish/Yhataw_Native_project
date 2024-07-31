module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};

module.exports = {
  presets: ['expo'],
  plugins: ['react-native-reanimated/plugin'],
};
