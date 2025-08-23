import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import NavigationPage from './src/navigation/NavigationPage';
import QueryProvider from './src/providers/QueryProvider';
import { PaperProvider } from 'react-native-paper';

export default function App() {
  // Set this to true to test the Paytm-style bottom navigation
  const showTestBar = true; // Change to true to test

  return (
    <Provider store={store}>
      <PaperProvider>
        <QueryProvider>
          <NavigationPage showTestBar={showTestBar} />
        </QueryProvider>
      </PaperProvider>
    </Provider>
  );
}
