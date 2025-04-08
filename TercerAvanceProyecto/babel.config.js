module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  presets: ['babel-preset-expo'],
  plugins: [
    'react-native-reanimated/plugin',
    ['@babel/plugin-transform-private-methods', { loose: true }]
  ],
};
