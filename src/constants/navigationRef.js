// src/navigationRef.js
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function go(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
