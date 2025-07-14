import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import NavigationPage from './src/navigation/NavigationPage';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationPage />
    </Provider>
  );
}
