import { useState, useRef, useEffect } from "react";
import {
  TextInput,
  View,
  Animated,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import Colors from '../constants/colors';

const InputField = ({
  children,
  label,
  isFocus = false,  // Default to false if not provided
  icon,
  value = '',      // Default to empty string if not provided
  placeholder,
  onChangeText,
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  editValue,
  currency,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(isFocus);
  const [text, setText] = useState(value  || isFocus && placeholder);

  const labelPosition = useRef(new Animated.Value(isFocus || text ? 1 : 0)).current;
  const textColor = editValue ? 'black' : 'gray'

  useEffect(() => {
    // If isFocus is true on mount, raise the label
    if (isFocus) {
      animatedLabel(1);
    }
  }, [isFocus]);

  const handleFocus = () => {
    setIsFocused(true);
    animatedLabel(1);
  };

  const handleBlur = (text) => {
    if (!text) {
      setIsFocused(false);
      animatedLabel(0);
    } else {
      return setIsFocused(true)
    }
  };

  const handleTextChange = (text) => {
    setText(text); 
    if (onChangeText) {
      onChangeText(text); 
    }
   
    if (text) {
      animatedLabel(1);
    } else {
      animatedLabel(isFocused ? 1 : 0);
    }
  };

  const animatedLabel = (toValue) => {
    Animated.timing(labelPosition, {
      toValue: toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const labelStyle = {
    left: 10,
    top: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -10],
    }),
    fontSize: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 14],
    }),
    color: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: ['gray', '#888'],
    }),
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="my-2 w-full">
          <View
            className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-[18px] border border-neutral-100 focus:border-[#0161c7] ${containerStyle}`}
            style={[
              isFocused && {
                shadowOffset: { width: 4, height: 10 },
                shadowColor: Colors.primary,
                shadowOpacity: 0.01,
                shadowRadius: 10,
              },
            ]}
          >
            <Animated.Text
              className={`absolute ${
                isFocused ? "bg-white" : "bg-transparent"
              } font-mregular px-0.5 -pt-3 -py-10`}
              style={labelStyle}
            >
              {label}
            </Animated.Text>
            <View>
              {icon ? (
                <Image
                  source={icon}
                  style={[{ width: 24, height: 24 }, iconStyle]} // Combine default and passed styles
                />
              ) : (
                <View style={iconStyle}>{children}</View>
              )}
            </View>
            <TextInput
              className={`rounded-full p-4 font-JakartaSemiBold text-[18px] flex-1 ${inputStyle} text-left`}
              secureTextEntry={secureTextEntry}
              onFocus={handleFocus}
              onBlur={handleBlur} 
              value={text}
              onChangeText={handleTextChange}
              textAlignVertical="center"
              spellCheck={false}
              keyboardType={props.keyType}
              enablesReturnKeyAutomatically 
              {...props}
              style={{ color: textColor }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
