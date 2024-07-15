import { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TextInput, View } from 'react-native';

const TextField = ({value, name, onChangeText, containerStyle, otherStyles, placeholder, ...props }) => {

  const [isFocused, setIsFocused] = useState(false);
  const [ text, setText] = useState('');
  const [color, setColor] = useState('bg-gray-70')
  const labelPosition = useRef(new Animated.Value(text ? 1 : 0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    animatedLabel(1);
    setColor("bg-inherit")
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!text) {
      animatedLabel(0);
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
      outputRange: [18, -15],
    }),
    fontSize: labelPosition.interpolate({
      inputRange: [1, 2],
      outputRange: [20, 19],
    }),
    color: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: ['#000', '#000'],
    }),
  };

  return (
    <View className={`mx-2 border-b-white ${containerStyle}`}>
      <View className=" focus:border-0 bg-white " style={[styles.innerContainer]}>
        <Animated.Text className={`absolute font-mregular px-1 -mt-1 text-xl ${color} rounded-[25px]`} style={labelStyle}>{placeholder}</Animated.Text>
        <View style={styles.inputContainer}>
            <TextInput
              {...props}
              style={styles.input}
              className='font-mregular border-gray-200'
              onFocus={handleFocus}
              onBlur={handleBlur}
              editable={props.editable}
              onPressIn={props.onPressMe}
              onChangeText={handleTextChange}
              value={value}
              textContentType={props.contentType}
              keyboardType={props.keyType}
              enablesReturnKeyAutomatically 
            />
            {
              props.errorText && (
                <View className="my-4">
                  <Text className="bg-red-500 text-[12px]">{props.errorText[0]}</Text>
                </View>
              )
}
        </View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#dcdcdc',
    height: 55,
    justifyContent: 'center',
    
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 20,
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

export default TextField