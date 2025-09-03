import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  loginFailure,
  loginRequest,
  loginSuccess,
} from '../../redux/authSlice';
import { loginUser } from '../../apis/loginUser';
import { sendOtp } from '../../apis/sendOtp';
import { ArrowLeft, MapPin } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchBar from '../../components/SearchBar/SearchBar';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async () => {
    if (phoneNumber.length !== 10) {
      alert('Please enter a valid 10-digit phone number');
      console.log('Invalid phone number:', phoneNumber);
      return;
    }
    console.log('Sending OTP to:', phoneNumber);
    try {
      const response = await sendOtp({ phoneNumber });
      console.log('sendOtp response:', response);
      if (response && response.success) {
        setShowOtpInput(true);
        setOtpSent(true);
        console.log('OTP field shown, OTP sent');
      } else {
        alert(response?.message || 'Failed to send OTP');
        console.log('Failed to send OTP:', response?.message);
      }
    } catch (error) {
      console.error('sendOtp error:', error);
      alert('An error occurred while sending OTP');
    }
  };

  const handleResendOtp = async () => {
    console.log('Resending OTP to:', phoneNumber);
    try {
      const response = await sendOtp({ phoneNumber });
      console.log('Resend OTP response:', response);
      if (response?.success) {
        alert('OTP resent successfully');
      } else {
        alert(response?.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      alert('Failed to resend OTP');
    }
  };

  const handleLogin = async () => {
    if (phoneNumber && phoneNumber.length === 10 && otp.length === 6) {
      console.log('Attempting login with:', phoneNumber, 'OTP:', '******');
      const fcmToken = await AsyncStorage.getItem('fcmToken');
      console.log('Login FCM Token:', fcmToken);
      const payload = { phoneNumber, otp, fcmToken };
      dispatch(loginRequest());
      try {
        const response = await loginUser(payload);
        console.log('Login API Response:', response);
        if (response.success) {
          dispatch(
            loginSuccess({ token: response.token, user: response.user }),
          );
          console.log('Login Success:', response.token);
          navigation.navigate('BottomTabs');
        } else {
          dispatch(loginFailure(response.message));
          alert(response.message);
        }
      } catch (error) {
        dispatch(loginFailure('An error occurred during login'));
        alert('An error occurred during login');
        console.error('Login error:', error);
      }
    } else {
      alert('Please enter a valid phone number and OTP');
    }
  };

  const handleSignUpPress = () => {
    navigation.navigate('SignupScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF5E1" />
      <View style={styles.headerWrapper}>
        <SafeAreaView>
          <View style={styles.headerRow}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <ArrowLeft size={30} color="#000" />
            </TouchableOpacity>
            <SearchBar />
            <TouchableOpacity style={styles.locationButton} activeOpacity={1}>
              <MapPin color="#FFA500" size={24} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
      <View style={styles.content}>
        <Text style={styles.heading}>Login to PetCaart</Text>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={text => {
            const digitsOnly = text.replace(/[^0-9]/g, '');
            if (digitsOnly.length <= 10) {
              setPhoneNumber(digitsOnly);
            }
          }}
          placeholder="Enter your 10-digit phone number"
          keyboardType="number-pad"
          editable={!showOtpInput}
        />

        {showOtpInput && (
          <>
            <TouchableOpacity onPress={() => setShowOtpInput(false)}>
              <Text style={styles.editText}>Edit Number</Text>
            </TouchableOpacity>
            <Text style={styles.label}>OTP</Text>
            <TextInput
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter OTP"
              keyboardType="number-pad"
            />
            {otpSent && (
              <TouchableOpacity onPress={handleResendOtp}>
                <Text style={styles.editText}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={showOtpInput ? handleLogin : handleSendOtp}
          activeOpacity={1}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {showOtpInput ? (loading ? 'Logging in...' : 'Login') : 'Send OTP'}
          </Text>
        </TouchableOpacity>

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don’t have an account? </Text>
          <TouchableOpacity activeOpacity={1} onPress={handleSignUpPress}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF6',
  },
  content: {
    alignContent: 'center',
    padding: 20,
  },
  headerWrapper: {
    paddingVertical: 10,
    backgroundColor: '#FEF5E7',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  backButton: {
    paddingRight: 15,
  },
  locationButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  heading: {
    fontSize: 26,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#f79e1b',
    marginBottom: 40,
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  button: {
    backgroundColor: '#f79e1b',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Gotham-Rounded-Bold',
    fontSize: 16,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#333',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  signupLink: {
    color: '#f79e1b',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  editText: {
    alignSelf: 'flex-end',
    color: '#f79e1b',
    fontFamily: 'Gotham-Rounded-Bold',
    marginBottom: 10,
  },
});
