/**
 * Mood — feel everything.
 *
 * Entry point for the React Native app.
 * Sets up global providers and renders the navigation tree.
 */

import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { StyleSheet } from 'react-native';

const App = () => (
  <GestureHandlerRootView style={styles.root}>
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
