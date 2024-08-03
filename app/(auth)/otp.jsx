import { router } from 'expo-router';
import React, { useState, useEffect,useRef } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { OtpInput } from "react-native-otp-entry";


const OtpScreen = ({value}) => {
const [otpCode, setOtpCode] = useState('')
const sheet = useRef();


const [isPinReady, setIsPinReady] = useState(false);


  const handleSubmit = (otpCode) => {
    setOtpCode(otpCode)
    sheet.current.close()
    setIsPinReady(true)
  };

  return (
    <ScrollView keyboardShouldPersistTaps='handled'>
    <View className="flex-1 px-7">
        <Text className='text-gray-600 font-mregular pt-7'>
          We have sent a verification code to 
        </Text>
        <Text className="font-mbold text-[16px] mb-7">{value}</Text>
        <View className="border-b border-b-[#CCC]"/>
        <Text className="font-mregular text-[15px] my-7">Enter code</Text>


      <View className='flex-row pl-2'>
        <OtpInput
          numberOfDigits={5}
          focusColor="#1F41BB"
          focusStickBlinkingDuration={500}
          autoFocusOnLoad
          //onTextChange={(text) => console.log(text)}
          onFilled={(otpCode) => handleSubmit(otpCode)}
          textInputProps={{
            accessibilityLabel: "One-Time Password",
          }}
          theme={{
            containerStyle: styles.container,
            pinCodeContainerStyle: styles.pinCodeContainer,
            pinCodeTextStyle: styles.pinCodeText,
            focusStickStyle: styles.focusStick,
            focusedPinCodeContainerStyle: styles.activePinCodeContainer,
          }}
        />
      </View>

      {isPinReady && (
        router.push('/reset-pwd')
      )}
      
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    width: 55,
    height: 55,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    marginHorizontal: 5,
    fontSize: 18,
    borderRadius: 8,
  },
  container: {
  },
  pinCodeContainer: {
    borderRadius: 5,
    borderColor: 'gray',
    height: 50,
    backgroundColor: "white",
    borderWidth: 1.2
  },
  pinCodeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
  },
  focusStick: {
    //color: "#1F41BB",
    height: 22
  },
  activePinCodeContainer: {

  }
});

export default OtpScreen;

