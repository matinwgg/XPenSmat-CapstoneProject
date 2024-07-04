import React, {useState} from 'react';
import { Text, View, KeyboardAvoidingView, Image, ScrollView } from 'react-native';
import { icons, images } from '../../constants'
import { Link, router } from 'expo-router';
import CustomButton from '../../components/CustomButton'
import { useForm } from 'react-hook-form';
import FormField from '../../components/FormField';


export default function ResetPassword () {
    const {control, handleSubmit, formState: {errors}} = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');


    const submit = () => {
      router.push('/confirm-new-pwd')
    }

    return (
      <KeyboardAvoidingView className="bg-gray flex-1 min-h-[100vh]">
        <ScrollView showsVerticalScrollIndicator="false"  keyboardShouldPersistTaps='handled'>
        <View className="p-5">
            <Link href="/sign-in" className='mt-[50px]'>
            <Image source={icons.left_back} resizeMode='contain' className="w-8 h-8 mt-10"/>
            </Link>
        </View>

        <View className="relative -mt-10">
          <View className="self-center">
          <Image source={images.forget_pwd} resizeMode='contain' className="w-[320px] h-[320px] -mt-[110px]"/>
          </View>

          <View className="px-5 -ml-2">
            <View className="relative justify-around -mt-7">
              <Text className="text-black text-[35px] font-nextrabold">Create new password</Text>
            </View>
            <View className="relative bottom-9">
              <Text className="text-black font-nregular mt-10">
                Your new password must be different from previous password
              </Text>
            </View>
        <View className="">
                
            <View className="ml-1">
                <FormField
                  containerStyle="w-[340px]"
                  placeholder={'Password'}
                  onChangeText={setPassword}
                  error={passwordError}
                  secureTextEntry
              />

              <FormField
                  containerStyle="w-[340px] mt-5"
                  placeholder={'Confirm Password'}
                  onChangeText={setPassword}
                  error={passwordError}
                  secureTextEntry
              />
            </View>

          <View className="mt-5 flex-row ">
            <Image source={icons.check} resizeMode='contain' className="w-5 h-5"/>
            <Text className="ml-2 mt-[2px] font-mregular">Must not contain your name or email</Text>
          </View>

          <View className="mt-2 flex-row ">
            <Image source={icons.check} resizeMode='contain' className="w-5 h-5"/>
            <Text className="ml-2 mt-[2px] font-mregular">At least 8 characters </Text>
          </View>

          <View className="mt-2 flex-row ">
            <Image source={icons.check} resizeMode='contain' className="w-5 h-5"/>
            <Text className="ml-2 mt-[2px] font-mregular">Must contain a symbol and a number</Text>
          </View>

          {/* Button  */}
          <View className="mt-[55px] w-[330px] self-center">
            <CustomButton 
              title="Create" 
              otherStyles="rounded-[25px]"              
              handlePress={handleSubmit(submit)}
            
            />
          </View>
        </View>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

