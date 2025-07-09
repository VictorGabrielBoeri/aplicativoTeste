import React from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigationContainerRef } from '@react-navigation/native';
import Navigation from './src/navigation';

function App() {
  const navigationRef = useNavigationContainerRef();
  const [currentRoute, setCurrentRoute] = React.useState('Login');

  return (
    <>
      {currentRoute !== 'Login' && (
        <>
          <StatusBar barStyle="light-content" backgroundColor="#006633" />
          <View style={styles.statusBarExtension} />
        </>
      )}
      {currentRoute === 'Login' && (
        <StatusBar 
          barStyle="dark-content" 
          backgroundColor="transparent" 
          translucent 
        />
      )}
      <NavigationContainer
        ref={navigationRef}
        onStateChange={() => {
          const currentRouteName = navigationRef.getCurrentRoute()?.name;
          if (currentRouteName) {
            setCurrentRoute(currentRouteName);
          }
        }}
      >
        <Navigation />
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  statusBarExtension: {
    backgroundColor: '#006633',
    height: 60,
  },
});

export default App;
