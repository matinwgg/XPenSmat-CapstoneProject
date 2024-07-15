import { ScrollView, Alert, StyleSheet, Text, View, TouchableOpacity, Image, Platform } from 'react-native'
import React, {useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../constants'
import FormField from '../../components/FormField'
import {Link, router} from 'expo-router'
import CustomButton  from '../../components/CustomButton'
import { useGlobalContext } from '../../context/GlobalProvider'
import * as AppleAuthentication from 'expo-apple-authentication';
// import { supabase } from 'app/utils/supabase'
import colors from "../../constants/colors";


import { getCurrentUser, signIn } from '../../lib/appwrite'


const SignIn = () => {
  
  const { setUser, setIsLoggedIn } = useGlobalContext()
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    email: "",
    password: "",
  });


const submit = async () => {
  if ( !form.email || !form.password) {
    return Alert.alert("Error", "Please fill in all the fields")
  }
  setIsSubmitting(true)

    await signIn(form.email, form.password)

    try {
    const result = await getCurrentUser();

    setUser(result)
    setIsLoggedIn(true)

    Alert.alert("Success", "You've signed in successfully")
    router.push('/(drawer)/(tabs)/home')

  } catch(error) {
    Alert.alert('Error', error.message)
  }
    finally { setIsSubmitting(false)}

}

const SignInWithApple = () => {
  if (Platform.OS === 'ios')
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={{ width: 200, height: 64 }}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            })
            // Sign in via Supabase Auth.
            if (credential.identityToken) {
              const {
                error,
                data: { user },
              } = await supabase.auth.signInWithIdToken({
                provider: 'apple',
                token: credential.identityToken,
              })
              console.log(JSON.stringify({ error, user }, null, 2))
              if (!error) {
                // User is signed in.
              }
            } else {
              throw new Error('No identityToken.')
            }
          } catch (e) {
            if (e.code === 'ERR_REQUEST_CANCELED') {
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
            }
          }
        }}
      />
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white px-5">
      <ScrollView showsVerticalScrollIndicator="false">
      <View>
            <View>
            {/* <Image 
              source={icons.bank} 
              resizeMode='contain'
              className="w-[100px] h-[50px] mt-[30px] self-start -ml-5 mb-5"/>             */}

            <Text className="font-mbold text-5xl mt-[65px] text-[#1F41BB]">Login</Text>

            <FormField 
              title="Email"
              value={form.email}
              containerStyle="w-[100%] mt-8"
              placeholder={'Email'}
              contentType='emailAddress'
              //maxLength={25}
              //rules={{required: 'Username is required',}}
              onChangeText={(e) => setForm({ ...form, email: e })}
              keyType="email-address"

           />

            <FormField
              title="Password"
              containerStyle="w-[100%] mt-10"
              value={form.password}
              placeholder={'Password'}
              contentType='password'
              onChangeText={(e) => setForm({ ...form, password: e })}
              secureTextEntry
              //rules={{required: 'Password is required', minLength: {value: 8, message: 'Password should be minimum 8 characters long'}}}
            />

          <Link href="/forgot-pwd" className="text-right font-psemibold text-pblack mr-2 mt-1 text-[#0161C7]">Forgot Password?</Link>

          <CustomButton 
              title="Sign In"
              handlePress={submit}
              containerStyles="mt-[40px] mb-[20px]"
              isLoading={isSubmitting}
          />
          
            <View className="px-2.5 mb-4">
                <View style={styles.divider}/>
                <Text className="self-center bottom-[9px] font-mregular relative bg-white w-10 px-3">Or</Text>
            </View>
             {/* <View style={styles.deviderCon}>
            <View style={styles.devider} />
            <Text style={styles.or}>OR</Text>
          </View> */}

        <TouchableOpacity onPress={() => {}} className='border border-gray-300 rounded-full py-3 mb-4 w-full flex-row items-center justify-center'>
            <Image source={icons.google} resizeMode='contain' className='w-6 h-6 mr-2' />
            <Text className='text-gray-600 font-pmedium'>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity className='border border-gray-300 rounded-full py-3 mb-4 w-full flex-row items-center justify-center'>
        <Image source={icons.facebook} resizeMode='contain' className='w-7 h-7 mr-2 -ml-3' />
        <Text className='text-gray-600 font-pmedium'>Continue Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={SignInWithApple} className='border border-gray-300 rounded-full py-3 mb-4 w-full flex-row items-center justify-center'>
        <Image source={icons.apple} resizeMode='contain' className='w-6 h-6 mr-2 -ml-1' />
        <Text className='text-gray-600 font-pmedium'>Continue with Apple</Text>
      </TouchableOpacity>


            <View className="flex-row self-center mt-5">
                <Text className="font-pmedium ">Don't have an account? </Text>
                <TouchableOpacity
                  onPress={() => router.push('/sign-up')}>
                    <Text className="font-pbold text-[#0161C7]">Sign up</Text> 
                </TouchableOpacity>
            </View>
           
            </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn

const styles = StyleSheet.create({
  divider: {
    borderBottomColor: '#aaa',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: 20,
  },
})