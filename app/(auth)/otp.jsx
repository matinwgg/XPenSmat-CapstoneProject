import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const OtpScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input
    if (text && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleSubmit = () => {
    // Handle the submit action
    console.log('OTP submitted:', otp.join(''));
  };

  return (
    <>
    <View style={{ flex: 1, backgroundColor: 'gray' }} />
  
    <View className='flex-1 justify-center items-center bg-white p-4'>
      <Text className='text-2xl font-bold mb-4'>OTP</Text>
      {/* Illustration can be added here */}
      <Text className='text-2xl font-bold mb-4'>Verification Code</Text>
      <Text className='text-gray-600 mb-8 text-center'>
        We have sent a verification code to your mobile number
      </Text>

      <View className='flex-row justify-center mb-8'>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            className="w-[50px] h-[50px] border border-[#CCC] text-center mx-1 font-plight text-lg rounded-md "
            maxLength={1}
            keyboardType="numeric"
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
          />
        ))}
      </View>

      <TouchableOpacity className='bg-blue-500 rounded-full py-4 px-12' onPress={handleSubmit}>
        <Text className='text-white font-bold'>Submit</Text>
      </TouchableOpacity>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    marginHorizontal: 5,
    fontSize: 18,
    borderRadius: 8,
  },
});

export default OtpScreen;

