import React, {useState, useRef } from 'react';
import { Text, View, KeyboardAvoidingView, TouchableOpacity, StyleSheet, Image, ScrollView, Platform, Alert } from 'react-native';
import { icons, images } from '../../constants'
import { Link, router } from 'expo-router';
import CustomButton from '../../components/CustomButton'
import { recoverPwd } from '../../lib/appwrite';
import FormField from '../../components/FormField'

const ForgotPwd = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

    const [token, setToken] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [maskedEmailId, setMaskedEmailId] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(false);
    

    const submit = async () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if(inputValue === "") {
        return Alert.alert("Email required!")
      }

      setIsSubmitting(true)
      
        // First, test the email against the regex
        const isValidEmail = emailRegex.test(inputValue.trim());

        // Update the state with the validation result
        setIsValidEmail(isValidEmail);

      try {
        if (isValidEmail) {
          await recoverPwd.recovery(inputValue.trim()).then((value) => {
            if (value) {
              Alert.alert("We've recover mail Sent", "Tap on it to get verfied");
              //router.replace("/reset-pwd")
            } else {
              Alert.alert("Email not sent")
            }
          })
        
        }
      } catch (error) {
        return Alert.alert("Invalid Email", "Check your email id")
      } finally { 
        setIsSubmitting(false)
      }
     
  }

  return (
    <View>
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'position' : 'height'}
            >
          <ScrollView keyboardShouldPersistTaps='handled'>
            <Link href="/sign-in" className='mt-[60px] ml-5'>
              <Image source={icons.left_back} resizeMode='contain' className="w-8 h-8 mt-10"/>
            </Link>

        <View className="relative -mt-10 ml-3">
          <View className="self-center">
          <Image source={images.forget_pwd} resizeMode='contain' className="w-[320px] h-[320px]"/>
          </View>

          <View className="px-5">
            <View className="justify-around -mt-7">
              <Text className="text-[40px] font-pextrabold">Forgot Password?</Text>
            </View>
            <View className="relative bottom-9">
              <Text className="font-pregular mt-10">
                Don't worry! It happens, please enter the address associated
                with your account
              </Text>
            </View>
              <View className="">
                
                <View className="">
                   <FormField 
                    title="Email"
                    value={inputValue}
                    containerStyle="w-[100%] mt-8"
                    placeholder={'Email address'}
                    contentType='emailAddress'
                    onChangeText={(e) => setInputValue(e)}
                    keyType="email-address"

                />
                </View>
              

            <View className="mt-7 mb-10 w-[330px] self-center">

            <CustomButton 
              title="Submit" 
              otherStyles="min-h-[50px]"              
              handlePress={submit}
              isLoading={isSubmitting}
            />
            </View>
            </View>
          </View>
        </View>
        </ScrollView>
        </KeyboardAvoidingView>
      </View>

);
}

export default ForgotPwd;
