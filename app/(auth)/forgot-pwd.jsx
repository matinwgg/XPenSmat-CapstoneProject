import React, {useState, useRef } from 'react';
import { Text, View, KeyboardAvoidingView, Image, ScrollView, Platform } from 'react-native';
import { icons, images } from '../../constants'
import { Link, router } from 'expo-router';
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import { useForm } from 'react-hook-form';
import {BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomBottomSheet from '../../components/CustomBottomSheet';


export default function ResetPassword () {
  const {control, handleSubmit, formState: {errors}} = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [email, setEmail] = useState('');


    const bottomSheetModalRef = useRef(null)
    const snapPoints = [ "80%"]
    const [ isOpen, setIsOpen ] = useState(false)

    function handlePresentModal() {
      bottomSheetModalRef.current?.present()
      setTimeout(()=> {
        setIsOpen(true)
      }, 400)
    }
    

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : 'height'} className="flex-1">
          <ScrollView keyboardShouldPersistTaps='handled'>
        <View className={`p-5 ${isOpen ? 'bg-gray-200' : ''}`}>
            <Link href="/sign-in" className='mt-[50px]'>
            <Image source={icons.left_back} resizeMode='contain' className="w-8 h-8 mt-10"/>
            </Link>
        </View>

        <View className="realative -mt-10 ml-3">
          <View className="self-center">
          <Image source={images.forget_pwd} resizeMode='contain' className="w-[320px] h-[320px]"/>
          </View>

          <View className="px-5">
            <View className="relative justify-around -mt-7">
              <Text className="text-black text-[40px] font-nextrabold">Forgot Password?</Text>
            </View>
            <View className="relative bottom-9">
              <Text className="text-black font-nregular mt-10">
                Don't worry! It happens, please enter the address associated
                with your account
              </Text>
            </View>
              <View className="">
                <View>
                   {/* <SvgIcon icon={'at'} width={20} height={20} />  */}
                </View>
                {/* TextInput */}
                <View className="">
                  <CustomInput 
                    placeholder="Enter Email address or Phone number"
                    handleChangeText={setEmail}
                    
                    />
                </View>
              

            <View className="mt-7 mb-10 w-[330px] self-center">
            <CustomButton 
              title="Submit" 
              otherStyles="min-h-[50px]"              
              handlePress={handlePresentModal}
            />
            </View>
          <BottomSheetModal ref={bottomSheetModalRef} index={0} snapPoints={snapPoints} backgroundStyle={{ borderRadius: 25 }} onDismiss={() => setIsOpen(false)} enablePanDownToClose={false}>
              <CustomBottomSheet />
          </BottomSheetModal>
            </View>
          </View>
        </View>
        </ScrollView>
        </KeyboardAvoidingView>
        </BottomSheetModalProvider>
         </GestureHandlerRootView>

    );
  }



