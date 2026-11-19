import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Spacing from '../constants/spacing';
import Colors from '../constants/colors';

/**
 * Primary call-to-action button.
 *
 * `disabled` is honoured visually and behaviourally, and the secondary variant
 * uses brand-coloured text (the previous implementation left white text on a
 * white background).
 */
const CustomButton = ({
  title,
  isLoading = false,
  handlePress,
  containerStyles,
  type = 'PRIMARY',
  otherStyles,
  textStyles,
  disabled = false,
  icon = null,
  accessibilityLabel,
}) => {
  const isSecondary = type === 'SECONDARY';
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={isDisabled ? undefined : handlePress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: Boolean(isDisabled), busy: Boolean(isLoading) }}
      className={`w-full ${containerStyles || ''} ${otherStyles || ''}`}
      style={[
        styles.container,
        isSecondary && styles.secondary,
        isDisabled && styles.disabled,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={isSecondary ? Colors.primary : '#FFFFFF'} />
      ) : (
        <View style={styles.content}>
          {icon ? <View style={styles.icon}>{icon}</View> : null}
          <Text
            style={[styles.label, isSecondary && styles.secondaryLabel]}
            className={`text-center font-psemibold text-base ${textStyles || ''}`}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 52,
    justifyContent: 'center',
    paddingVertical: Spacing * 1.4,
    paddingHorizontal: Spacing * 2,
    width: '100%',
    borderRadius: Spacing + 4,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 3,
  },
  secondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowOpacity: 0,
    elevation: 0,
  },
  disabled: {
    opacity: 0.55,
    shadowOpacity: 0,
    elevation: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  secondaryLabel: {
    color: Colors.primary,
  },
});

export default CustomButton;
