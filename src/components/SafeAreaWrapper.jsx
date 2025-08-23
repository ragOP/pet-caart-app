import React from 'react';
import { StyleSheet, Platform, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const SafeAreaWrapper = ({
  children,
  style,
  backgroundColor = '#fff',
  edges = ['top', 'right', 'bottom', 'left'],
  ...props
}) => {
  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor },
        style
      ]}
      // edges={edges}
      {...props}
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

export default SafeAreaWrapper; 