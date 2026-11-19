import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const COLORS = {
  text: '#0F172A',
  muted: '#94A3B8',
  border: '#E2E8F0',
  brand: '#1F41BB',
  disabled: '#F8FAFC',
  danger: '#DC2626',
};

/**
 * The app's standard text input.
 *
 * Supports a `prefix` (currency symbols), a `rightAccessory` (calendar icon),
 * focus styling and an inline error message. Both `handleTextChange` and
 * `onChangeText` are accepted because the screens historically used both.
 */
const TextField = ({
  value,
  handleTextChange,
  onChangeText,
  containerStyle,
  otherStyles,
  inputStyle,
  placeholder,
  prefix,
  rightAccessory,
  error,
  editable = true,
  multiline = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const onChange = handleTextChange || onChangeText;

  return (
    <View className={containerStyle}>
      <View
        style={[
          styles.innerContainer,
          multiline && styles.multiline,
          { borderColor: error ? COLORS.danger : isFocused ? COLORS.brand : COLORS.border },
          !editable && styles.disabled,
          isFocused && styles.focused,
        ]}
        className={otherStyles}
      >
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}

        <TextInput
          {...props}
          style={[styles.input, multiline && styles.multilineInput, !editable && styles.disabledText, inputStyle]}
          className="font-pregular"
          placeholder={placeholder}
          placeholderTextColor={props.placeholderTextColor || COLORS.muted}
          value={value}
          editable={editable}
          multiline={multiline}
          onFocus={(event) => {
            setIsFocused(true);
            props.onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            props.onBlur?.(event);
          }}
          onChangeText={onChange}
          autoCorrect={props.autoCorrect ?? false}
          keyboardType={props.keyType || props.keyboardType}
          textContentType={props.contentType || props.textContentType}
        />

        {rightAccessory ? <View style={styles.accessory}>{rightAccessory}</View> : null}
      </View>

      {error ? (
        <Text style={styles.errorText} numberOfLines={2}>
          {typeof error === 'string' ? error : 'Please check this field.'}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    height: 56,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
  },
  focused: {
    borderWidth: 1.5,
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  multiline: {
    height: 'auto',
    minHeight: 56,
    paddingVertical: 10,
  },
  disabled: {
    backgroundColor: COLORS.disabled,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 0,
  },
  multilineInput: {
    height: 'auto',
    minHeight: 36,
    paddingTop: 0,
    textAlignVertical: 'top',
  },
  disabledText: {
    color: '#64748B',
  },
  prefix: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: 8,
  },
  accessory: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginTop: 6,
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.danger,
  },
});

export default TextField;
