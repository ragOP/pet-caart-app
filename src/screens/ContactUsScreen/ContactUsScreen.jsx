import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
  ScrollView,
} from 'react-native';
import { ArrowLeft, ChevronRight, Truck, Trash2, Phone, Mail } from 'lucide-react-native';

const ContactUsScreen = ({ navigation }) => {
  const handleTrackOrder = () => {
    // Navigate to track order screen or show modal
    alert('Track Order functionality will be implemented here');
  };

  const handleReturnOrder = () => {
    // Navigate to return order screen or show modal
    alert('Return Order functionality will be implemented here');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF5E1" />
      <View style={styles.headerWrapper}>
        <SafeAreaView>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ArrowLeft size={30} color="#000" />
            </TouchableOpacity>
            <Text style={styles.header}>Contact Us</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.content}>
        {/* Get in Touch Section */}
        <Text style={styles.sectionTitle}>Get in Touch</Text>
        
        <View style={styles.optionContainer}>
          <TouchableOpacity style={styles.optionRow} onPress={handleTrackOrder}>
            <View style={styles.optionLeft}>
              <Truck size={24} color="#004E6A" />
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Track Order</Text>
                <Text style={styles.optionSubtitle}>View status of the order</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#f79e1b" />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.optionRow} onPress={handleReturnOrder}>
            <View style={styles.optionLeft}>
              <Trash2 size={24} color="#004E6A" />
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Return Order</Text>
                <Text style={styles.optionSubtitle}>Return and view the items in order</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#f79e1b" />
          </TouchableOpacity>
        </View>

        {/* Contact Information Section */}
        <Text style={styles.sectionTitle}>GET IN TOUCH</Text>
        <Text style={styles.contactIntro}>If you have any inquiries, feel free to</Text>

        <View style={styles.contactContainer}>
          <View style={styles.contactRow}>
            <Phone size={24} color="#004E6A" />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Call us at</Text>
              <Text style={styles.contactValue}>1800-5723-575</Text>
            </View>
          </View>

          <View style={styles.contactRow}>
            <Mail size={24} color="#004E6A" />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Email us at</Text>
              <Text style={styles.contactValue}>support@petcaart.com</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF6',
  },
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
  backButton: {
    paddingRight: 15,
  },
  header: {
    fontSize: 24,
    flex: 1,
    paddingLeft: 20,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  optionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    marginLeft: 15,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#333',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 20,
  },
  contactIntro: {
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#333',
    marginBottom: 20,
  },
  contactContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  contactText: {
    marginLeft: 15,
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#333',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#333',
  },
});

export default ContactUsScreen; 