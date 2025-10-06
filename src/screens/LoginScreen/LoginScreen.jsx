import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import {
  loginFailure,
  loginRequest,
  loginSuccess,
} from '../../redux/authSlice';
import { loginUser } from '../../apis/loginUser';
import { sendOtp } from '../../apis/sendOtp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft } from 'lucide-react-native';
import SearchBar from '../../components/SearchBar/SearchBar';
import { updateProfile } from '../../apis/updateProfile';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(60);
  const [otpSending, setOtpSending] = useState(false);

  const currentStep = showEmailInput ? 3 : showOtpInput ? 2 : 1;

  useEffect(() => {
    let interval = null;
    if (resendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [resendDisabled, timer]);

  const handleSendOtp = async () => {
    if (phoneNumber.length !== 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    setOtpSending(true);
    try {
      const response = await sendOtp({ phoneNumber });
      console.log('sendOtp response:', response);
      if (response?.success) {
        setShowOtpInput(true);
        setResendDisabled(true);
        setTimer(60);
      } else {
        alert(response?.message || 'Failed to send OTP');
      }
    } catch {
      alert('An error occurred while sending OTP');
    }
    setOtpSending(false);
  };

  const handleResendOtp = async () => {
    try {
      const response = await sendOtp({ phoneNumber });
      console.log('resendOtp response:', response);
      if (response?.success) {
        setResendDisabled(true);
        setTimer(60);
        alert('OTP resent successfully');
      } else {
        alert(response?.message || 'Failed to resend OTP');
      }
    } catch {
      alert('Failed to resend OTP');
    }
  };

  const handleLogin = async () => {
    if (phoneNumber.length === 10 && otp.length === 6) {
      const fcmToken = await AsyncStorage.getItem('fcmToken');
      const payload = { phoneNumber, otp, fcmToken };
      dispatch(loginRequest());
      try {
        const response = await loginUser(payload);
        console.log('loginUser response:', response);
        if (response.user && response.token) {
          if (response.isExisitinguser === false) {
            setShowEmailInput(true);
          } else {
            dispatch(
              loginSuccess({ token: response.token, user: response.user }),
            );
            navigation.navigate('BottomTabs');
          }
        } else {
          dispatch(loginFailure('Login failed: incomplete response'));
          alert('Login failed: incomplete response');
        }
      } catch {
        dispatch(loginFailure('An error occurred during login'));
        alert('An error occurred during login');
      }
    } else {
      alert('Please enter a valid phone number and OTP');
    }
  };

  const handleCompleteRegistration = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    try {
      const response = await updateProfile({ data: { phoneNumber, email } });
      console.log('updateProfile response:', response);
      if (response?.success) {
        dispatch(loginSuccess({ token: response.token, user: response.user }));
        navigation.navigate('BottomTabs');
      } else {
        alert(response?.message || 'Registration failed');
      }
    } catch {
      alert('An error occurred during registration');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
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
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.content}>
          <Image
            style={styles.logo}
            source={require('../../assets/images/logo1.png')}
            resizeMode="contain"
          />
          <View style={styles.stepIndicatorContainer}>
            <View
              style={[
                styles.stepCircle,
                currentStep >= 1 ? styles.activeStep : styles.inactiveStep,
              ]}
            >
              <Text
                style={
                  currentStep >= 1 ? styles.stepNumberActive : styles.stepNumber
                }
              >
                1
              </Text>
            </View>
            <View
              style={[
                styles.stepLine,
                currentStep >= 2
                  ? styles.activeStepLine
                  : styles.inactiveStepLine,
              ]}
            />
            <View
              style={[
                styles.stepCircle,
                currentStep >= 2 ? styles.activeStep : styles.inactiveStep,
              ]}
            >
              <Text
                style={
                  currentStep >= 2 ? styles.stepNumberActive : styles.stepNumber
                }
              >
                2
              </Text>
            </View>
            <View
              style={[
                styles.stepLine,
                currentStep === 3
                  ? styles.activeStepLine
                  : styles.inactiveStepLine,
              ]}
            />
            <View
              style={[
                styles.stepCircle,
                currentStep === 3 ? styles.activeStep : styles.inactiveStep,
              ]}
            >
              <Text
                style={
                  currentStep === 3
                    ? styles.stepNumberActive
                    : styles.stepNumber
                }
              >
                3
              </Text>
            </View>
          </View>
          {!showOtpInput && !showEmailInput && (
            <>
              <Text style={styles.label}>Enter Mobile Number</Text>
              <View style={styles.phoneInputWrapper}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.phoneInput}
                  value={phoneNumber}
                  onChangeText={text => {
                    const digitsOnly = text.replace(/[^0-9]/g, '');
                    if (digitsOnly.length <= 10) setPhoneNumber(digitsOnly);
                  }}
                  placeholder="Enter Mobile Number"
                  keyboardType="number-pad"
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.button,
                  (phoneNumber.length !== 10 || loading) &&
                    styles.buttonDisabled,
                ]}
                onPress={handleSendOtp}
                activeOpacity={1}
                disabled={phoneNumber.length !== 10 || loading}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  {otpSending && <ActivityIndicator size={18} color="#fff" />}
                  <Text style={styles.buttonText}>Send OTP</Text>
                </View>
              </TouchableOpacity>
            </>
          )}
          {showOtpInput && !showEmailInput && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12,
                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.label}>
                  Enter OTP sent to +91 {phoneNumber}
                </Text>
                <TouchableOpacity onPress={() => setShowOtpInput(false)}>
                  <Text
                    style={{
                      color: '#004E6A',
                      fontFamily: 'Gotham-Rounded-Bold',
                      paddingBottom: 10,
                    }}
                  >
                    Edit Number
                  </Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                value={otp}
                onChangeText={text => {
                  const digitsOnly = text.replace(/[^0-9]/g, '');
                  if (digitsOnly.length <= 6) setOtp(digitsOnly);
                }}
                placeholder="Enter 6-digit OTP"
                keyboardType="number-pad"
              />
              <TouchableOpacity
                style={[
                  styles.button,
                  (otp.length !== 6 || loading) && styles.buttonDisabled,
                ]}
                onPress={handleLogin}
                activeOpacity={0.7}
                disabled={otp.length !== 6 || loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Logging in...' : 'Verify OTP'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleResendOtp}
                disabled={resendDisabled}
                style={{ marginTop: 10 }}
              >
                <Text
                  style={{
                    color: resendDisabled ? '#6a899a' : '#004E6A',
                    fontFamily: 'Gotham-Rounded-Bold',
                    textAlign: 'center',
                  }}
                >
                  {resendDisabled ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
            </>
          )}
          {showEmailInput && (
            <>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleCompleteRegistration}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>Complete Registration</Text>
              </TouchableOpacity>
            </>
          )}
          <Text style={styles.terms}>By continuing, you agree to our </Text>
          <Text style={styles.termsCol}>
            Terms of Service and Privacy Policy
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 20,
  },
  headerWrapper: {
    paddingVertical: 10,
    backgroundColor: '#ffffff',
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
  logo: {
    marginTop: 10,
    width: 200,
    height: 80,
    alignSelf: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'Gotham-Rounded-Bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  countryCode: {
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Bold',
    marginRight: 10,
  },
  phoneInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  button: {
    backgroundColor: '#004E6A',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#004E6A90',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Gotham-Rounded-Bold',
    fontSize: 16,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: '#004E6A',
  },
  inactiveStep: {
    backgroundColor: '#0000001a',
  },
  stepNumber: {
    color: '#666',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  stepNumberActive: {
    color: '#fff',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  stepLine: {
    width: 40,
    height: 4,
    marginRight: 10,
    marginLeft: 10,
  },
  activeStepLine: {
    backgroundColor: '#004E6A',
  },
  inactiveStepLine: {
    backgroundColor: '#0000001a',
  },
  terms: {
    fontSize: 14,
    color: '#6a899a',
    marginBottom: 2,
    fontFamily: 'gotham-rounded-book',
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 10,
  },
  termsCol: {
    color: '#004E6A',
    fontFamily: 'gotham-rounded-book',
    textAlign: 'center',
    lineHeight: 16,
    fontSize: 14,
  },
});

export default LoginScreen;
