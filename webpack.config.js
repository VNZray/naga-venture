module.exports = {
  webpack: (config) => {
    config.resolve.alias['react-native-maps'] = require.resolve(
      './mocks/react-native-maps'
    );
    config.resolve.alias['node_modules/@react-native-picker/picker/dist/module/PickerIOS'] = require.resolve(
      './mocks/PickerIOS'
    );
    return config;
  },
};
