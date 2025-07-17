import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Platform
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

const Terms = ({navigation}) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF5E1" />

      <View style={styles.headerWrapper}>
        <SafeAreaView>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ArrowLeft size={30} color="#000" />
            </TouchableOpacity>
            <Text style={styles.header}>Terms and Conditions</Text>
          </View>
        </SafeAreaView>
      </View>

 
      <Text style={styles.subHeader}>Terms and Conditions</Text>
      <ScrollView>
      <Text style={styles.termsText}>
      <Text style={styles.sectionHeader}>1. Acceptance of Terms</Text>
        {"\n"}By accessing or using the PetCaart website, mobile application, or services (collectively referred to as the “Service”), you agree to comply with and be bound by these Terms and Conditions, as well as our Privacy Policy.
        {"\n"}If you do not agree to these terms, you should not use the Service.

        {"\n\n"}<Text style={styles.sectionHeader}>2. Eligibility</Text>
        {"\n"}The offer is valid for registered users who invite friends using their unique referral link.

        {"\n\n"}<Text style={styles.sectionHeader}>3. Reward Structure</Text>
        {"\n"}When your friend signs up using your referral link and places their first order, both of you will receive a 50% discount coupon for your next purchase.
        {"\n"}The discount applies to one-time use only and is valid on orders above ₹499.

        {"\n\n"}<Text style={styles.sectionHeader}>4. Referral Limit</Text>
        {"\n"}You can invite as many friends as you like, but the 50% discount can be earned a maximum of 5 times per user during the offer period.

        {"\n\n"}<Text style={styles.sectionHeader}>5. Discount Validity</Text>
        {"\n"}The discount coupon is valid for 30 days from the date of issue.
        {"\n"}Offer not applicable on sale or promotional items.

        {"\n\n"}<Text style={styles.sectionHeader}>6. Order Status</Text>
        {"\n"}The reward will only be issued after your friend's first order is successfully delivered and not cancelled or returned.

        {"\n\n"}<Text style={styles.sectionHeader}>7. Non-Transferable</Text>
        {"\n"}Referral rewards are non-transferable and cannot be redeemed for cash.

        {"\n\n"}<Text style={styles.sectionHeader}>8. Abuse of Program</Text>
        {"\n"}Any fraudulent activity or misuse of the referral system may lead to disqualification from the program.

        {"\n\n"}<Text style={styles.sectionHeader}>9. Modification Rights</Text>
        {"\n"}We reserve the right to modify or terminate the referral program at any time without prior notice.

        {"\n\n"}<Text style={styles.sectionHeader}>10. General Terms</Text>
        {"\n"}By using the PetCaart referral program, you acknowledge that you have read, understood, and agree to these terms. The referral program is subject to change at the sole discretion of PetCaart.
      </Text>
    </ScrollView>
</View>
  )
}

export default Terms;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBF6' },
  headerWrapper: {
    paddingVertical: 20,
    backgroundColor: '#FEF5E7',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 },
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
  termsText: {
    fontSize: 14,
    padding: 20,
    color: '#555',
    fontStyle:'italic'
  },
  sectionHeader: {
    fontSize: 16,
    marginVertical: 5,
  },
});
