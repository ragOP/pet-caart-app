import { ArrowLeft, MapPin } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';

const SignUpScreen = ({navigation}) => {
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phoneNumber: '',
    otp: '',
  });

  const handleChange = (key, value) => {
    if (key === 'phoneNumber') {
      const digitsOnly = value.replace(/[^0-9]/g, '');
      if (digitsOnly.length <= 10) {
        setForm({ ...form, phoneNumber: digitsOnly });
      }
    } else {
      setForm({ ...form, [key]: value });
    }
  };

  const handleSendOtp = () => {
    if (form.name.trim() === '') {
      alert('Please enter your name');
      return;
    }
    if (form.phoneNumber.length === 10) {
      setShowOtpInput(true);
      alert('OTP sent! Use 123456 for testing.');
    } else {
      alert('Please enter a valid 10-digit phone number');
    }
  };

  const handleRegister = () => {
    if (form.otp === '123456') {
      const signupData = {
        name: form.name,
        phoneNumber: form.phoneNumber,
        otp: 123456
      };
      console.log('Signup Data:', signupData);
      alert('Registered successfully!');
      navigation.navigate('BottomTabs');
    } else {
      alert('Please enter the correct OTP (123456)');
    }
  };

  const handleEditNumber = () => {
    setShowOtpInput(false);
    setForm({ ...form, otp: '' });
  };

  const handleLoginPress = () => {
    navigation.navigate('LoginScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF5E1" />
      <View style={styles.headerWrapper}>
        <SafeAreaView>
          <View style={styles.headerRow}>
            <TouchableOpacity activeOpacity={1} onPress={() => navigation.goBack()} style={styles.backButton}>
              <ArrowLeft size={30} color="#000" />
            </TouchableOpacity>
            <View style={styles.headerCenter} />
            <TouchableOpacity style={styles.locationButton} activeOpacity={1}>
              <MapPin color="#FFA500" size={24} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.heading}>
          Create your <Text style={styles.brand}>PetCaart </Text>
          <Text>Account</Text>
        </Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={(v) => handleChange('name', v)}
          placeholder="Enter your full name"
          editable={!showOtpInput}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={form.phoneNumber}
          onChangeText={(v) => handleChange('phoneNumber', v)}
          placeholder="Enter 10-digit phone number"
          keyboardType="number-pad"
          editable={!showOtpInput}
        />

        {showOtpInput && (
          <>
            <TouchableOpacity onPress={handleEditNumber}>
              <Text style={styles.editText}>Edit Number</Text>
            </TouchableOpacity>

            <Text style={styles.label}>OTP</Text>
            <TextInput
              style={styles.input}
              value={form.otp}
              onChangeText={(v) => handleChange('otp', v)}
              placeholder="Enter OTP (123456)"
              keyboardType="number-pad"
              maxLength={6}
            />
            <Text style={styles.otpHint}>Use 123456 as OTP for testing</Text>
          </>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={showOtpInput ? handleRegister : handleSendOtp}
          activeOpacity={1}
        >
          <Text style={styles.buttonText}>
            {showOtpInput ? 'Register' : 'Send OTP'}
          </Text>
        </TouchableOpacity>

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Already a user? </Text>
          <TouchableOpacity activeOpacity={1} onPress={handleLoginPress}>
            <Text style={styles.signupLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF6',
  },
  headerWrapper: {
    paddingVertical: 10,
    backgroundColor: '#FEF5E7',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  backButton: {
    paddingRight: 15,
  },
  headerCenter: {
    flex: 1,
  },
  locationButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  heading: {
    fontSize: 26,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  brand: {
    color: '#f79e1b',
    fontFamily: 'Gotham-Rounded-Bold',
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
  otpHint: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'Gotham-Rounded-Medium',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
});
