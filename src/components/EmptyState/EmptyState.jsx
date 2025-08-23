import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  actionText, 
  onAction, 
  iconSize = 80,
  iconColor = '#AAB2BD',
  containerStyle,
  titleStyle,
  subtitleStyle,
  actionStyle,
  isLoading = false
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.iconContainer}>
        {Icon && (
          <Icon 
            size={iconSize} 
            color={iconColor} 
            strokeWidth={1.5} 
          />
        )}
      </View>
      
      <Text style={[styles.title, titleStyle]}>
        {title}
      </Text>
      
      {subtitle && (
        <Text style={[styles.subtitle, subtitleStyle]}>
          {subtitle}
        </Text>
      )}
      
      {actionText && onAction && (
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            actionStyle,
            isLoading && styles.actionButtonDisabled
          ]} 
          onPress={onAction}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.actionText}>
              {actionText}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
    backgroundColor: '#fff',
  },
  iconContainer: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    fontFamily: 'Gotham-Rounded-Light',
  },
  actionButton: {
    backgroundColor: '#F4A300',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Gotham-Rounded-Medium',
  },
});

export default EmptyState; 