import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { ArrowLeft, Share2, Copy } from 'lucide-react-native';
import Clipboard from '@react-native-clipboard/clipboard';

const InviteScreen = ({ navigation }) => {
  const [link] = useState('https://www.figma.com/design');
  const handleCopy = () => {
    Clipboard.setString(link);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF5E1" />

      <View style={styles.headerWrapper}>
        <SafeAreaView>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <ArrowLeft size={30} color="#000" />
            </TouchableOpacity>
            <Text style={styles.header}>Invite Friends</Text>
          </View>
        </SafeAreaView>
      </View>

      <Text style={styles.subHeader}>Invite a friend</Text>

      <View style={styles.content}>
        <Image
          source={require('../../assets/images/invitee.png')}
          style={styles.image}
        />

        <Text style={styles.inviteText}>
          <Text style={styles.blueText}>Invite your fellow pet lovers</Text> —
          you and your friend both get 50% off on your next order.{' '}
          <Text style={styles.blueTextItalic}>
            Because sharing treats (and discounts) is what true pet parents do!
          </Text>
        </Text>

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate('Terms')}
        >
          <Text style={styles.termsText}>Terms and Conditions</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            value="https://www.figma.com/design"
            editable={false}
            style={styles.linkInput}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleCopy}
            activeOpacity={1}
          >
            <Copy size={18} color="#fff" />
            <Text style={styles.buttonText}>COPY LINK</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>SHARE</Text>
            <Share2 size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.socialText}>SHARE ON SOCIAL MEDIA</Text>

        <View style={styles.socialIcons}>
          <Image
            source={require('../../assets/icons/instagram.png')}
            style={styles.icon}
          />
          <Image
            source={require('../../assets/icons/facebook.png')}
            style={styles.icon}
          />
          <Image
            source={require('../../assets/icons/linkedin.png')}
            style={styles.icon}
          />
          <Image
            source={require('../../assets/icons/x.png')}
            style={styles.icon}
          />
          <Image
            source={require('../../assets/icons/whatsapp.png')}
            style={styles.icon}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerWrapper: {
    paddingVertical: 20,
    backgroundColor: '#FEF5E7',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  backButton: { paddingRight: 15 },
  header: {
    fontSize: 24,
    flex: 1,
    paddingLeft: 20,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  subHeader: {
    fontSize: 16,
    padding: 10,
    color: '#555',
    marginVertical: 10,
    fontFamily: 'Gotham-Rounded-Medium',
    borderBottomWidth: 0.2,
  },
  content: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
    width: 300,
    height: 300,
    marginBottom: 10,
  },
  inviteText: {
    textAlign: 'center',
    fontSize: 14,
    marginVertical: 15,
    color: '#555',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  blueText: {
    color: '#007C91',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  blueTextItalic: {
    color: '#007C91',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  termsText: {
    color: '#004E6A',
    fontFamily: 'Gotham-Rounded-Light',
    marginVertical: 8,
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#6A6868',
    borderWidth: 2,
    marginVertical: 15,
  },
  linkInput: {
    padding: 15,
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#004E6A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    gap: 8,
    width: '48%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  socialText: {
    fontStyle: 'italic',
    color: '#444',
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 15,
    marginVertical: 15,
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
});

export default InviteScreen;
