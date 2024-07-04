import { ScrollView, Alert, StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity, Image } from 'react-native'
import React, {useState, useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../constants'
import FormField from '../../components/FormField'
import {Link, router} from 'expo-router'
import CustomButton  from '../../components/CustomButton'
import { useGlobalContext } from '../../context/GlobalProvider'
import Home from '../(drawer)/(tabs)/home'
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google'

WebBrowser.maybeCompleteAuthSession();

import { getCurrentUser, signIn } from '../../lib/appwrite'

const EMAIL_REGEX =  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const SignIn = () => {
  
  let isValid = false

  let isPwdValid = false

  const { setUser, setIsLogged } = useGlobalContext()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

   const validate = () => {
   if (EMAIL_REGEX.test(form.email)) {
     isValid = true
   }
   if (form.password != form.confirmpwd) {
     isPwdValid = true
   }

   if (isValid && isPwdValid) {
     setModalVisible(true)
   }
   }

const submit = async () => {
  //router.push('/(drawer)/(tabs)/home')
  if ( !form.email || !form.password) {
    Alert.alert('Error', 'Please fill in all the fields')
  }
  setIsSubmitting(true)
  try {
    await signIn(form.email, form.password)
    const result = await getCurrentUser();
    setUser(result)
    setIsLogged(true)

    Alert.alert("Success", "You've signed in successfully")
    router.push('/(drawer)/(tabs)/home')

  } catch(error) {Alert.alert('Error', error.message)}
    finally { setIsSubmitting(false)}

}

const [accessToken, setAccessToken] = useState(null)
const [user, setUserr] = useState(null)
const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  clientId: "126322592094-q0ohnm26i6hq2cmul4so60k2igo1nen9.apps.googleusercontent.com",
  iosClientId: "126322592094-meu1b8m3vup4mhfdufehsdbcsf0t88eu.apps.googleusercontent.com "
})
useEffect(() => {
  if(response?.type === "success") {
    setAccessToken(response.authentication.accessToken)
    accessToken && fetchUserInfo()
  }
}, [response, accessToken])

async function fetchUserInfo() {
  let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  const useInfo = await response.json()
  setUserr(useInfo)
}

const ShowUserInfo = () => {
  if (user) {
    router.push('/(drawer)/(tabs)/home')
  }
}

  return (
    <>
    {user && <ShowUserInfo />}
    {user === null &&  <SafeAreaView className="flex-1 bg-white px-5">
      <ScrollView showsVerticalScrollIndicator="false">
      <View>
            <View>
            {/* <Image 
              source={icons.bank} 
              resizeMode='contain'
              className="w-[100px] h-[50px] mt-[30px] self-start -ml-5 mb-5"/>             */}

            <Text className="font-mbold text-4xl mt-20 ">Login</Text>

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

          <Link href="/forgot-pwd" className="text-right font-psemibold text-pblack mr-2 mt-1 text-sky-700">Forgot Password?</Link>

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

        

        <TouchableOpacity onPress={() => {
          promptAsync();
        }} className='border border-gray-300 rounded-full py-3 mb-4 w-full flex-row items-center justify-center'>
            <Image source={icons.google} resizeMode='contain' className='w-6 h-6 mr-2' />
            <Text className='text-gray-600 font-pmedium'>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity className='border border-gray-300 rounded-full py-3 mb-4 w-full flex-row items-center justify-center'>
        <Image source={icons.facebook} resizeMode='contain' className='w-7 h-7 mr-2 -ml-3' />
        <Text className='text-gray-600 font-pmedium'>Continue Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity className='border border-gray-300 rounded-full py-3 mb-4 w-full flex-row items-center justify-center'>
        <Image source={icons.apple} resizeMode='contain' className='w-6 h-6 mr-2 -ml-1' />
        <Text className='text-gray-600 font-pmedium'>Continue with Apple</Text>
      </TouchableOpacity>


            <View className="flex-row self-center mt-5">
                <Text className="font-pmedium ">Don't have an account? </Text>
                <TouchableOpacity
                  onPress={() => router.push('/sign-up')}>
                    <Text className="font-pbold text-sky-700">Sign up</Text> 
                </TouchableOpacity>
            </View>
           
            </View>
      </View>
      </ScrollView>
    </SafeAreaView>
    }
   
    </>
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