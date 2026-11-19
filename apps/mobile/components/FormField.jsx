import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';

const COLORS = {
  text: '#0F172A',
  muted: '#94A3B8',
  border: '#E2E8F0',
  brand: '#1F41BB',
  danger: '#DC2626',
};

/**
 * Floating-label input used by the authentication screens.
 *
 * The label floats whenever the field is focused or has a value, so the
 * placeholder never overlaps typed text. The previous version kept an internal
 * copy of the text that could drift out of sync with the controlled value.
 */
const FormField = ({
  value = '',
  name,
  onChangeText,
  containerStyle,
  placeholder,
  secureTextEntry = false,
  errorText,
  contentType,
  keyType,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHidden, setIsHidden] = useState(Boolean(secureTextEntry));
  const hasValue = String(value ?? '').length > 0;
  const isFloating = isFocused || hasValue;

  return (
    <View className={`w-full ${containerStyle || ''}`}>
      <View
        style={[
          styles.container,
          isFocused && styles.focused,
          errorText ? styles.hasError : null,
        ]}
      >
        {placeholder ? (
          <Text
            pointerEvents="none"
            style={[
              styles.label,
              {
                top: isFloating ? 8 : 18,
                fontSize: isFloating ? 11 : 15,
                color: errorText ? COLORS.danger : isFocused ? COLORS.brand : COLORS.muted,
                backgroundColor: isFloating ? '#FFFFFF' : 'transparent',
              },
            ]}
          >
            {placeholder}
          </Text>
        ) : null}

        <TextInput
          {...props}
          name={name}
          value={value}
          onChangeText={onChangeText}
          onFocus={(event) => {
            setIsFocused(true);
            props.onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            props.onBlur?.(event);
          }}
          style={styles.input}
          placeholder=""
          secureTextEntry={secureTextEntry ? isHidden : false}
          textContentType={contentType}
          keyboardType={keyType}
          autoCorrect={props.autoCorrect ?? false}
          textAlignVertical="center"
          placeholderTextColor={COLORS.muted}
        />

        {secureTextEntry ? (
          <TouchableOpacity
            onPress={() => setIsHidden((hidden) => !hidden)}
            style={styles.eyeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel={isHidden ? 'Show password' : 'Hide password'}
          >
            <Feather
              name={isHidden ? 'eye' : 'eye-off'}
              size={20}
              color={COLORS.muted}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {errorText ? (
        <Text style={styles.errorText} numberOfLines={2}>
          {typeof errorText === 'string' ? errorText : 'Please check this field.'}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    height: 60,
    justifyContent: 'center',
  },
  focused: {
    borderColor: COLORS.brand,
    borderWidth: 1.5,
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  hasError: {
    borderColor: COLORS.danger,
  },
  label: {
    position: 'absolute',
    left: 12,
    paddingHorizontal: 4,
    fontFamily: 'Poppins-Regular',
    zIndex: 1,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 4,
    fontFamily: 'Poppins-Regular',
  },
  eyeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
  errorText: {
    marginTop: 6,
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.danger,
  },
});

export default FormField;
