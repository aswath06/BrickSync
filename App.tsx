import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {Navigation} from './src/Navigations/Navigations';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <Navigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor:'white'
  },
});

export default App;
