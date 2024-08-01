import { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Dimensions } from 'react-native';
import { icons } from '../constants'
import Colors from '../constants/colors'
const { height } = Dimensions.get("window");
import Spacing from "../constants/spacing";


const FormField = ({value, name, onChangeText, containerStyle, placeholder, ...props }) => {

  const [isFocused, setIsFocused] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const [ text, setText] = useState('');
  
  const [showPassword, setShowPassword] = useState(props.secureTextEntry);
  const labelPosition = useRef(new Animated.Value(text ? 1 : 0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    animatedLabel(1);
  };

  const handleBlur = () => {
    if (!text) {
      setIsFocused(false);
      animatedLabel(0);
    } else {
      return setIsFocused(true)
    }
  };

  const handleTextChange = ( text ) => {
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
    <View className={`mr-5 ${containerStyle}`}>
      <View className="border-gray-200 focus:border-[#1F41BB] focus:border-[2px]" style={[styles.innerContainer, isFocused && {
          borderWidth: 1,
          shadowOffset: { width: 4, height: Spacing },
          shadowColor: Colors.primary,
          shadowOpacity: 0.01,
          shadowRadius: Spacing,
        }]}>
        <Animated.Text className={`absolute  ${isFocused ? "bg-white" : "bg-transparent" } font-mregular px-0.5 -pt-3 -py-10`} style={ labelStyle }>{placeholder}</Animated.Text>
        <View style={styles.inputContainer}>
            <TextInput
              {...props}
              style={styles.input}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChangeText={handleTextChange}
              value={value}
              textAlignVertical="center"
              spellCheck={false}
              textContentType={props.contentType}
              keyboardType={props.keyType}
              enablesReturnKeyAutomatically 
              secureTextEntry={showPassword}
            />
            {
              props.errorText && (
                <View className="my-4">
                  <Text className="bg-red-500 text-[12px]">{props.errorText[0]}</Text>
                </View>
              )
            }

            {props.secureTextEntry &&  (
              <View>
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Image source={!showPassword ? icons.eye : icons.eyeHide}  className="w-6 h-6" resizeMode='contain'/>
                </TouchableOpacity>
              </View>
            )}
        </View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    backgroundColor: Colors.lightPrimary,
    borderWidth: 1,
    borderRadius: 20,
    height: 55,
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    height: 50,
    marginTop: 10,
    paddingLeft: 10,
  },
  errorText: {
    marginTop: 5,
    fontSize: 14,
    color: 'red',
  },
});

export default FormField