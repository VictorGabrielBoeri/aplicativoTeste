jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  const MockMapView = props => {
    return <View testID="map-view">{props.children}</View>;
  };
  const MockMarker = props => {
    return (
      <View testID={`map-marker-${props.identifier || props.key || 'unknown'}`}>
        {props.children}
      </View>
    );
  };

  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    PROVIDER_GOOGLE: 'google',
  };
});

jest.mock('@react-navigation/native', () => {
  return {
    NavigationContainer: ({ children }) => children,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

jest.mock('@react-navigation/native-stack', () => {
  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children }) => children,
      Screen: () => null,
    }),
  };
});
