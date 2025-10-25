import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
  Linking,
} from 'react-native';
import {
  ArrowLeft,
  Truck,
  Undo2,
  PhoneCall,
  Mail,
  ChevronRight,
} from 'lucide-react-native';

const ContactUsScreen = ({ navigation }) => {
  const handleCall = () => {
    Linking.openURL('tel:18005723575');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@petcaart.com');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.headerWrapper}>
        <SafeAreaView>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              activeOpacity={1}
            >
              <ArrowLeft size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.header}>Contact Us</Text>
          </View>
        </SafeAreaView>
      </View>
      <View style={styles.contentWrapper}>
        <View>
          <TouchableOpacity activeOpacity={1} style={styles.card}>
            <View style={styles.cardLeft}>
              <Truck size={28} color="#FF9F00" />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.cardTitle}>Track Order</Text>
                <Text style={styles.cardDesc}>View status of the order</Text>
              </View>
            </View>
            <ChevronRight size={24} color="#FFA500" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={1} style={styles.card}>
            <View style={styles.cardLeft}>
              <Undo2 size={28} color="#FF9F00" />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.cardTitle}>Return Order</Text>
                <Text style={styles.cardDesc}>
                  Return and view the items in order
                </Text>
              </View>
            </View>
            <ChevronRight size={24} color="#FFA500" />
          </TouchableOpacity>
        </View>

        {/* Bottom Contact Section */}
        <View style={styles.contactSection}>
          <Text style={styles.getInTouch}>GET IN TOUCH</Text>
          <Text style={styles.getInTouchDesc}>
            If you have any inquiries, feel free to
          </Text>

          <TouchableOpacity
            activeOpacity={1}
            style={styles.row}
            onPress={handleCall}
          >
            <PhoneCall size={24} color="#005B64" style={styles.contactIcon} />
            <Text style={styles.contactText}>
              Call us at <Text style={styles.bold}>1800-5723-575</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            style={styles.row}
            onPress={handleEmail}
          >
            <Mail size={24} color="#005B64" style={styles.contactIcon} />
            <Text style={styles.contactText}>
              Email us at <Text style={styles.bold}>support@petcaart.com</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  backButton: {
    paddingRight: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardDesc: {
    fontSize: 13,
    color: '#444',
    marginTop: 3,
  },
  contactSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  getInTouch: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
  },
  getInTouchDesc: {
    color: '#444',
    fontSize: 14,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  contactIcon: {
    marginRight: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ContactUsScreen;
