import { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { icons } from '../constants'


const FormField = ({value, name, onChangeText, containerStyle, placeholder, ...props }) => {

  const [isFocused, setIsFocused] = useState(false);
  const [ title, setTitle] = useState('');
  const [showPassword, setShowPassword] = useState(props.secureTextEntry);
  const labelPosition = useRef(new Animated.Value(title ? 1 : 0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    animatedLabel(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!title) {
      animatedLabel(0);
    } 
  };

  const handleTextChange = ( title ) => {
    setTitle(title);
    if (onChangeText) {
      onChangeText(title);
    }
    if (title) {
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
      <View className="focus:border-sky-500 focus:border-2 focus:border-solid  focus:shadow-[-2px_2px_24px_16px_rgba(51,200,203,0.4)]" style={[styles.innerContainer]}>
        <Animated.Text className="absolute font-pmedium px-0.5 bg-[#FFFFFF] -pt-3 rounded-[25px]" style={ labelStyle}>{placeholder}</Animated.Text>
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
              secureTextEntry={showPassword}
            />

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
        {props.emailValidation && (
              <Text className="text-red-500 self-stretch pl-3.5">Invalid email address</Text>
          )}
        
        {props.passwordValidation && (
              <Text className="text-red-500 self-stretch pl-3.5">Passwords do not match</Text>
          )}
          
      </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    height: 55,
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    color: 'gray',
    
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