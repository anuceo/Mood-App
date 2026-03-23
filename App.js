/**
 * Mood — feel everything.
 *
 * Entry point. Wraps the app in:
 *   GestureHandlerRootView — required by react-native-gesture-handler
 *   SafeAreaProvider        — safe area insets for all screens
 *   AppProvider             — global auth, feed, and board state
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => (
  <GestureHandlerRootView style={styles.root}>
    <SafeAreaProvider>
      <AppProvider>
        <AppNavigator />
      </AppProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;
