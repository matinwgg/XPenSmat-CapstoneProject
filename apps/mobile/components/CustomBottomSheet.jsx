import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, Image } from 'react-native';
import { icons } from '../constants'
import CustomButton from './CustomButton';
import { router } from 'expo-router'


const CustomBottomSheet = () => {
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

  const bottomSheetModalRef = useRef(null)

    const [ isOpen, setIsOpen ] = useState(false)
    
  const handleCollapsePress = () => {
      router.replace('/reset-pwd')
  }
  

  const handleSubmit = () => {
    // Handle the submit action
    //console.log('OTP submitted:', otp.join(''));
    
  };

  return (
    <View className={`flex-1 bg-white p-5 ${isOpen ? 'bg-gray-200' : "" }`}>
        <TouchableOpacity onPress={handleCollapsePress}>
        <Image source={icons.close} resize="contain" className="w-6 h-6 self-end mr-2 -mt-2"/>
        </TouchableOpacity>
      
      {/* Illustration can be added here */}
      <Text className='text-gray-600 mt-4  font-mregular'>
        We have sent a verification code to 
      </Text>
      <Text className="font-mbold text-[16px] mb-7">xxx xxx 4286</Text>

      <Text className="font-mregular text-[15px] ">Enter code</Text>


      <View className='flex-row justify-center mt-8'>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            className="w-[65px] h-[60px] border border-[#CCC] text-center mx-3 font-plight text-lg rounded-md mb-5"
            maxLength={1}
            keyboardType="numeric"
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
          />
        ))}
      </View>

        <CustomButton type="SECONDARY" title="SEND ANOTHER CODE" otherStyles="self-start" textStyles="font-mbold text-[12px] text-black-100 "/>
    </View>


    
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

export default CustomBottomSheet;

