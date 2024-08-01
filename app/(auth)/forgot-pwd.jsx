import React, {useState, useRef } from 'react';
import { Text, View, KeyboardAvoidingView, TouchableOpacity, StyleSheet, Image, ScrollView, Platform } from 'react-native';
import { icons, images } from '../../constants'
import { Link, router } from 'expo-router';
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import RBSheet from 'react-native-raw-bottom-sheet';
import OtpScreen from './otp';

const ForgotPwd = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

    const sheet = useRef();

    const [inputValue, setInputValue] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isValidPhone, setIsValidPhone] = useState(false);
    const [ isVerify, setVerfiy ] = useState('false')

    const validateInput = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10,15}$/;

      setIsValidEmail(emailRegex.test(inputValue));
      setIsValidPhone(phoneRegex.test(inputValue));

      if (isVerify) {
        
      }
  };

  const verify = () => {

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
                  <CustomInput 
                    value={inputValue}
                    placeholder="Enter Email address or Phone number"
                    handleChangeText={e => setInputValue(e)}
                  />
                </View>
              

            <View className="mt-7 mb-10 w-[330px] self-center">
            <CustomButton 
              title="Submit" 
              otherStyles="min-h-[50px]"              
              //handlePress={isValidEmail && isValidPhone (setVerfiy(true))}
              handlePress={() => sheet.current.open()}
            />
            </View>
            </View>
          </View>
        </View>
        </ScrollView>
        </KeyboardAvoidingView>
        <View style={styles.container}>
            <RBSheet
            height={650}
            openDuration={180}
            closeDuration={140}
            ref={sheet}
            customModalProps={{
              animationType: 'slide',
              statusBarTranslucent: true,
            }}
            customStyles={{
              container: {
                borderTopLeftRadius: 0,
                borderTopRightRadius: 20,
                backgroundColor: '#e6e6e6'
              }}}>

              <View style={styles.sheetHeader}>
                  <TouchableOpacity
                      onPress={() => sheet.current.close()}
                      style={[styles.sheetButton]}>
                      <Image source={icons.close} resize='contain' style={styles.sheetButtonDone} className="h-5 w-5 self-ends" />
                      {/* <Text style={styles.sheetButtonDone}>Done</Text> */}
                  </TouchableOpacity>
              </View>

              <OtpScreen />

          </RBSheet>
          </View>
      </View>

);
}

export default ForgotPwd;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    
  },
  sheetContent: {
  },
  sheetHeader: {
    height: 40,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 0,
    //borderBottomWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
  },
  sheetButton: {
    height: '100%',
    paddingHorizontal: 20,
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  sheetButtonDone: {
    fontSize: 18,
    color: '#006BFF',
    fontWeight: '500',
    alignSelf: 'flex-end'
  },
})

