import React, { useEffect, useCallback, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Platform, Alert, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store, persistor } from './src/redux/store';
import NavigationPage from './src/navigation/NavigationPage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient();

const App = () => {
  const [initializing, setInitializing] = useState(false);

  // ---- Permissions (Android runtime + Firebase request) ----
  const requestUserPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      } catch (e) {
        console.warn('POST_NOTIFICATIONS request failed:', e);
      }
    }

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  }, []);

  // ---- Foreground FCM handler (no Notifee, use Alert/UI) ----
  const onMessageReceived = useCallback(async message => {
    console.log('📨 FG message:', message);
    const title = message?.notification?.title ?? 'New message';
    const body =
      message?.notification?.body ??
      (message?.data ? JSON.stringify(message.data) : '');
    Alert.alert(title, body);
  }, []);

  const registerAndGetTokens = useCallback(async () => {
    console.log('📲 Registering for remote messages…');
    await messaging().registerDeviceForRemoteMessages();

    if (Platform.OS === 'ios') {
      try {
        const apns = await messaging().getAPNSToken();
        if (apns) {
          console.log('🍏 APNs Token (hex):', apns);
          await AsyncStorage.setItem('apnToken', apns);
          console.log('💾 APNs Token saved to AsyncStorage');
        } else {
          console.log(
            '⚠️ APNs token not yet available (will be provided after registration).',
          );
        }
      } catch (e) {
        console.warn('getAPNSToken() error:', e);
      }
    }

    // FCM token
    const fcm = await messaging().getToken();
    console.log('🔥 FCM Token:', fcm);
    await AsyncStorage.setItem('fcmToken', fcm);

    // Keep in sync on refresh
    messaging().onTokenRefresh(async newToken => {
      console.log('♻️ FCM token refreshed:', newToken);
      await AsyncStorage.setItem('fcmToken', newToken);
    });
  }, []);

  useEffect(() => {
    const unsubOnMsg = messaging().onMessage(onMessageReceived);

    const unsubOpened = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('🔁 Opened from BG:', remoteMessage?.data);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('🚀 Opened from quit:', remoteMessage?.data);
        }
      });

    return () => {
      unsubOnMsg();
      unsubOpened();
    };
  }, [onMessageReceived]);

  // ---- Init on mount ----
  useEffect(() => {
    (async () => {
      setInitializing(true);
      const enabled = await requestUserPermission();
      if (!enabled) {
        Alert.alert(
          'Notifications disabled',
          'Enable from Settings to receive alerts.',
        );
      }
      await registerAndGetTokens();
      setInitializing(false);
    })();
  }, [requestUserPermission, registerAndGetTokens]);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <SafeAreaProvider>
            <NavigationPage />
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
