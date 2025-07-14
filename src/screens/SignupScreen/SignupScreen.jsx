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
} from 'react-native';
import SearchBar from '../../components/SearchBar/SearchBar';

const SignUpScreen = ({navigation}) => {
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    otp: '',
  });

  const handleChange = (key, value) => {
    if (key === 'phone') {
      const digitsOnly = value.replace(/[^0-9]/g, '');
      if (digitsOnly.length <= 10) {
        setForm({ ...form, phone: digitsOnly });
      }
    } else {
      setForm({ ...form, [key]: value });
    }
  };

  const handleSendOtp = () => {
    if (form.phone.length === 10) {
      setShowOtpInput(true);
    } else {
      alert('Please enter a valid 10-digit phone number');
    }
  };

  const handleRegister = () => {
    if (form.otp.length === 6) {
      alert('Registered successfully!');
    } else {
      alert('Please enter a valid OTP');
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
            <SearchBar />
            <TouchableOpacity style={styles.locationButton} activeOpacity={1}>
              <MapPin color="#FFA500" size={24} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
      <ScrollView contentContainerStyle={{     padding: 20, }}>
        <Text style={styles.heading}>
          Create your <Text style={styles.brand}>PetCaart </Text>
          <Text>Account</Text>
        </Text>

        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={form.firstName}
          onChangeText={(v) => handleChange('firstName', v)}
          placeholder="Enter first name"
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={form.lastName}
          onChangeText={(v) => handleChange('lastName', v)}
          placeholder="Enter last name"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={form.email}
          onChangeText={(v) => handleChange('email', v)}
          placeholder="Enter email"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={form.phone}
          onChangeText={(v) => handleChange('phone', v)}
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
              placeholder="Enter OTP"
              keyboardType="number-pad"
              maxLength={6}
            />
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
    backgroundColor: '#fff',
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
});
