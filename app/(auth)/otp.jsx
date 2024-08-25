import { router } from 'expo-router';
import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { OtpInput } from "react-native-otp-entry";
import { recoverPwd } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider'


const OtpScreen = ({ maskedEmailId, closeSheet, pattern }) => {
  const { user } = useGlobalContext()
  const sheet = useRef();

  const [otpCode, setOtpCode] = useState('')
  const [isPinReady, setIsPinReady] = useState(false);

  const validateOtp = () => {
    setOtpCode(otpCode)
    if (pattern.test(otpCode)) {
      return true
    } else {
      Alert.alert("Invalid Code", "Check and re-enter the correct pin sent to your email!")
      return false
      }
  }
  const handleSubmit = (otpCode) => {
    setIsPinReady(true)

      if (validateOtp) {
        try {
          //Otp.verifyOtp(user?.$id, otpCode)
          console.log(user?.$id)
          console.log(otpCode)
          alert("OTP verified")
          router.navigate('/reset-pwd')

      } catch (error) {
        console.log("Appwrite service :: OTPPin() :: " + Error(error.message));
      }
      }
  };

  return (
    <ScrollView keyboardShouldPersistTaps='handled'>
    <View className="flex-1 px-7">
        <Text className='text-gray-600 font-mregular pt-7'>
          We have sent a verification code to 
        </Text>
        <Text className="font-mbold text-[16px] mb-7">{maskedEmailId}</Text>
        <View className="border-b border-b-[#CCC]"/>
        <Text className="font-mregular text-[15px] my-7">Enter code</Text>


      <View className='flex-row pl-2'>
        <OtpInput
          numberOfDigits={6}
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
          closeSheet()
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

