import React from 'react';
import { View, StyleSheet, ActivityIndicator, Platform, Dimensions, Modal, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const CustomDialog = ({
  visible,
  onDismiss,
  title,
  message,
  primaryButtonText = 'OK',
  secondaryButtonText = 'Cancel',
  onPrimaryPress,
  onSecondaryPress,
  primaryButtonColor = '#f79e1b',
  secondaryButtonColor = '#666',
  showSecondaryButton = true,
  loading = false,
  children,
  type = 'default', // 'default', 'success', 'warning', 'error'
}) => {
  const handlePrimaryPress = () => {
    if (!loading) {
      onPrimaryPress?.();
      onDismiss();
    }
  };

  const handleSecondaryPress = () => {
    if (!loading) {
      onSecondaryPress?.();
      onDismiss();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={48} color="#f79e1b" />;
      case 'warning':
        return <AlertTriangle size={48} color="#f79e1b" />;
      case 'error':
        return <XCircle size={48} color="#f79e1b" />;
      default:
        return <Info size={48} color="#f79e1b" />;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={loading ? undefined : onDismiss}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.overlayTouchable} 
          activeOpacity={1} 
          onPress={loading ? undefined : onDismiss}
        />
        <View style={styles.dialogContainer}>
          <View style={styles.dialog}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              {getIcon()}
            </View>

            {/* Title */}
            {title && (
              <Text style={styles.title}>
                {title}
              </Text>
            )}

            {/* Message */}
            {message && (
              <Text style={styles.message}>
                {message}
              </Text>
            )}

            {/* Custom Children */}
            {children && (
              <View style={styles.childrenContainer}>
                {children}
              </View>
            )}

            {/* Actions */}
            <View style={styles.actions}>
              {showSecondaryButton && (
                <TouchableOpacity
                  onPress={handleSecondaryPress}
                  disabled={loading}
                  style={[styles.secondaryButton, { borderColor: secondaryButtonColor }]}
                >
                  <Text style={[styles.secondaryButtonText, { color: secondaryButtonColor }]}>
                    {secondaryButtonText}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handlePrimaryPress}
                disabled={loading}
                style={[styles.primaryButton, { backgroundColor: primaryButtonColor }]}
              >
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.loadingText}>Processing...</Text>
                  </View>
                ) : (
                  <Text style={styles.primaryButtonText}>
                    {primaryButtonText}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dialogContainer: {
    width: width * 0.85,
    maxWidth: 400,
  },
  dialog: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#333',
    fontSize: 20,
    fontFamily: 'Gotham-Rounded-Bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    color: '#666',
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Medium',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  childrenContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1.5,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    flex: 1,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#fff',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Medium',
  },
});

export default CustomDialog; 