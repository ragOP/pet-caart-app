import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import { MapPin, X } from 'lucide-react-native';

const PinBottomSheet = ({
  visible,
  onClose,
  onSubmit,
  loading,
  deliveryDate,
}) => {
  const [pincode, setPincode] = useState('');

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <Text style={styles.headerText}>Check Delivery by Pincode</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X color="#666" size={24} />
              </TouchableOpacity>

              <View style={styles.inputRow}>
                <MapPin color="#FFA500" size={24} style={styles.pinIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter PINCODE"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={pincode}
                  onChangeText={setPincode}
                  autoFocus
                  editable={!loading}
                />
              </View>

              {deliveryDate && visible ? (
                <View style={styles.resultContainer}>
                  <Text style={styles.resultTitle}>Delivery Available!</Text>
                  <Text style={styles.resultSubtitle}>
                    We deliver to pincode {pincode}
                  </Text>
                  <Text style={styles.resultDate}>
                    Expected delivery: {deliveryDate}
                  </Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={styles.checkButton}
                onPress={() => onSubmit(pincode)}
                activeOpacity={0.9}
                disabled={loading || pincode.length !== 6}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.checkButtonText}>Check</Text>
                )}
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    paddingBottom: 32,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  pinIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  resultContainer: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#155724',
    marginBottom: 4,
    textAlign: 'center',
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#155724',
    marginBottom: 2,
    textAlign: 'center',
  },
  resultDate: {
    fontSize: 14,
    color: '#155724',
    textAlign: 'center',
  },

  checkButton: {
    backgroundColor: '#0888B1',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  checkButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default PinBottomSheet;
