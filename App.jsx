import React, { useEffect, useCallback, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Platform, Alert, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store, persistor } from './src/redux/store';
import NavigationPage from './src/navigation/NavigationPage';

const App = () => {
  // const [initializing, setInitializing] = useState(false);
  // const requestUserPermission = useCallback(async () => {
  //   if (Platform.OS === 'android') {
  //     try {
  //       await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  //       );
  //     } catch (e) {
  //       console.warn('POST_NOTIFICATIONS request failed:', e);
  //     }
  //   }
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   return enabled;
  // }, []);
  // const onMessageReceived = useCallback(async message => {
  //   console.log('📨 FG message:', message);
  //   const title = message?.notification?.title ?? 'New message';
  //   const body =
  //     message?.notification?.body ??
  //     (message?.data ? JSON.stringify(message.data) : '');
  //   Alert.alert(title, body);
  // }, []);
  // const registerAndGetTokens = useCallback(async () => {
  //   console.log('📲 Registering for remote messages…');
  //   await messaging().registerDeviceForRemoteMessages();

  //   const fcm = await messaging().getToken();
  //   console.log('🔥 FCM Token:', fcm);
  //   await AsyncStorage.setItem('fcmToken', fcm);
  // }, []);

  // useEffect(() => {
  //   const unsubOnMsg = messaging().onMessage(onMessageReceived);

  //   const unsubOpened = messaging().onNotificationOpenedApp(remoteMessage => {
  //     console.log('🔁 Opened from BG:', remoteMessage?.data);
  //   });

  //   messaging()
  //     .getInitialNotification()
  //     .then(remoteMessage => {
  //       if (remoteMessage) {
  //         console.log('🚀 Opened from quit:', remoteMessage?.data);
  //       }
  //     });

  //   return () => {
  //     unsubOnMsg();
  //     unsubOpened();
  //   };
  // }, [onMessageReceived]);

  // useEffect(() => {
  //   (async () => {
  //     setInitializing(true);
  //     const enabled = await requestUserPermission();
  //     if (!enabled) {
  //       Alert.alert(
  //         'Notifications disabled',
  //         'Enable from Settings to receive alerts.',
  //       );
  //     }
  //     await registerAndGetTokens();
  //     setInitializing(false);
  //   })();
  // }, [requestUserPermission, registerAndGetTokens]);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationPage />
      </PersistGate>
    </Provider>
  );
};

export default App;
