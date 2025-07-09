module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|react-navigation|@react-navigation/.*|react-native-vector-icons)'
  ],
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: {
    '^react-native-vector-icons/MaterialIcons$': '<rootDir>/__mocks__/materialIconsMock.js'
  }
};
