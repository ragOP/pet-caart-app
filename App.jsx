import React, { useEffect, useCallback, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Platform, Alert, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store, persistor } from './src/redux/store';
import NavigationPage from './src/navigation/NavigationPage';

const queryClient = new QueryClient();

const AS_KEYS = {
  FCM: 'fcmToken',
  APNS: 'apnToken',
};

const saveToken = async (key, val) => {
  try {
    if (val) await AsyncStorage.setItem(key, String(val));
  } catch (e) {
    console.warn('AsyncStorage save error:', key, e);
  }
};

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

  const fetchAndPersistAPNSToken = useCallback(async () => {
    if (Platform.OS !== 'ios') return;
    try {
      const apns = await messaging().getAPNSToken();
      if (apns) {
        console.log('🍏 APNs Token (hex):', apns);
        await saveToken(AS_KEYS.APNS, apns);
      } else {
        console.log('⚠️ APNs token not yet available.');
      }
      // Best-effort re-read shortly after registration to catch late availability
      setTimeout(async () => {
        try {
          const apns2 = await messaging().getAPNSToken();
          if (apns2) await saveToken(AS_KEYS.APNS, apns2);
        } catch {}
      }, 2000);
    } catch (e) {
      console.warn('getAPNSToken() error:', e);
    }
  }, []);

  const registerAndGetTokens = useCallback(async () => {
    console.log('📲 Registering for remote messages…');
    await messaging().registerDeviceForRemoteMessages();

    await fetchAndPersistAPNSToken();

    // FCM token
    const fcm = await messaging().getToken();
    console.log('🔥 FCM Token:', fcm);
    await saveToken(AS_KEYS.FCM, fcm);

    // Keep in sync on refresh (FCM)
    messaging().onTokenRefresh(async newToken => {
      console.log('♻️ FCM token refreshed:', newToken);
      await saveToken(AS_KEYS.FCM, newToken);

      // Opportunistic APNs re-check on iOS
      if (Platform.OS === 'ios') {
        try {
          const apnsNow = await messaging().getAPNSToken();
          if (apnsNow) await saveToken(AS_KEYS.APNS, apnsNow);
        } catch {}
      }
    });
  }, [fetchAndPersistAPNSToken]);

  // ---- Subscribe to app-level notification events ----
  useEffect(() => {
    // Foreground
    const unsubOnMsg = messaging().onMessage(onMessageReceived);

    // Opened from background
    const unsubOpened = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('🔁 Opened from BG:', remoteMessage?.data);
    });

    // Opened from quit
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
          <NavigationPage />
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
