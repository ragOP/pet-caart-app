import React, { useEffect, useMemo, useState } from 'react';
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
import Share from 'react-native-share';
import { generateReferralCode } from '../../apis/generateReferralCode';

const InviteScreen = ({
  navigation,
  baseLink = 'https://www.petcaart.com/',
}) => {
  const [refCode, setRefCode] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await generateReferralCode();
        const code = res?.data?.referralCode || '';
        if (alive) setRefCode(code);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  const derivedLink = useMemo(() => {
    const base = (baseLink || '').replace(/\/+$/, '');
    if (!refCode) return base || '';
    const qs = new URLSearchParams({ ref: refCode }).toString();
    return `${base}?${qs}`;
  }, [baseLink, refCode]);

  const onCopyLink = () => Clipboard.setString(derivedLink);
  const onCopyCode = () => refCode && Clipboard.setString(refCode);

  const onShare = async () => {
    try {
      await Share.open({
        title: 'Invite to Pet App',
        message: `Hey! Join PetCaart using my referral link and I'll get ₹150 in my wallet when you complete your first order!${derivedLink}`,
        // url: derivedLink,
      });
    } catch {}
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

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
      <ScrollView>
        <Text style={styles.subHeader}>Invite a friend</Text>

        <View style={styles.content}>
          <Image
            source={require('../../assets/images/invitee.png')}
            style={styles.image}
          />

          <Text style={styles.inviteText}>
            <Text style={styles.blueText}>Invite your fellow pet lovers</Text> —
            you will get ₹150 in your wallet when your friend completes their
            first order.{' '}
            <Text style={styles.blueTextItalic}>
              when your friend completes their first order!
            </Text>
          </Text>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('Terms')}
          >
            <Text style={styles.termsText}>Terms and Conditions</Text>
          </TouchableOpacity>

          {/* Dynamic Referral Code */}
          <View style={styles.refBlock}>
            <Text style={styles.refLabel}>Your Referral Code</Text>
            <View style={styles.refCard}>
              <Text style={styles.refCode}>
                {loading ? '...' : refCode || '—'}
              </Text>
              <TouchableOpacity
                onPress={onCopyCode}
                activeOpacity={0.8}
                style={styles.copyPill}
                disabled={!refCode}
              >
                <Copy size={16} color="#D88C20" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Dynamic referral link */}
          <View style={styles.inputContainer}>
            <TextInput
              value={derivedLink}
              editable={false}
              style={styles.linkInput}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={onCopyLink}
              activeOpacity={1}
            >
              <Copy size={18} color="#fff" />
              <Text style={styles.buttonText}>COPY LINK</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={onShare}
              activeOpacity={1}
            >
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
              source={require('../../assets/icons/whatsapp.png')}
              style={styles.icon}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerWrapper: {
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
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
    lineHeight: 18,
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

  // Referral styles
  refBlock: {
    width: '100%',
    marginTop: 8,
    marginBottom: 14,
  },
  refLabel: {
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#323232',
    fontSize: 14,
    marginBottom: 8,
  },
  refCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#F1C88A',
    backgroundColor: '#FFF8EE',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  refCode: {
    flex: 1,
    color: '#D88C20',
    letterSpacing: 2,
    fontSize: 18,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  copyPill: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFEBD0',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#0888B1',
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
