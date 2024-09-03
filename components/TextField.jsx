import React, {useState} from 'react';
import { Keyboard } from 'react-native';
import { StyleSheet, Text, TextInput, View, Image, TouchableWithoutFeedback } from 'react-native';
import {countriesData} from "../partials/countriesData"

const TextField = ({ value, handleTextChange, containerStyle, otherStyles, placeholder, ...props }) => {
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(true);

  const countries = countriesData.countries;

  const matchedCodes = countries.filter(item => item.code === props.country)

  const validateInput = (value) => {
    // Example validation: input should not be empty and should be at least 3 characters long
    const valid = /^\d*$/.test(value);
    setIsValid(valid);
    setInputValue(value);
  };

  return (
      <View 
          className={`mx-2 border-gray-200 ${containerStyle} focus:border-[#1F41BB] focus:border-2 bg-white ${otherStyles}`} 
          style={[styles.innerContainer, styles.inputContainer , { borderColor: props.error ? "red" : "" }, props.locationStyles]}>
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              className='font-pregular'
              editable={props.editable}
              onBlur={() => Keyboard.dismiss()}
              onChangeText={handleTextChange}
              value={value}
              autoCorrect={false}
              textContentType={props.contentType}
              keyboardType={props.keyType}
              {...props}
            />
            {props.error && (
                <View className="my-4">
                  <Text className="bg-red-500 text-[12px]">Invalid input. Only digits are allowed.</Text>
                  {/* <Text className="bg-red-500 text-[12px]">{props.errorText[0]}</Text> */}
                </View>
              )}
              {/* {matchedCodes.length > 0 ? (matchedCodes.map(item => (
          
                  <View className="my-4">
                    <Text>{item.flag}</Text>
                </View>
              ))
            ) : (
              <Text>No matching country found.</Text>
            ) } */}
        </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#dcdcdc',
    height: 54,
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