import React from 'react';
import { StatusBar } from 'react-native';
import Navigation from './src/navigation';

function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#006633" />
      <Navigation />
    </>
  );
}

export default App;
