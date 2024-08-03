import { ScrollView, Alert, StyleSheet, Text, View, TouchableOpacity, Image, Platform } from 'react-native'
import React, {useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../constants'
import FormField from '../../components/FormField'
import {Link, router} from 'expo-router'
import CustomButton  from '../../components/CustomButton'
import { useGlobalContext } from '../../context/GlobalProvider'
import { getCurrentUser, signIn, SignInWithFacebook, SignInWithGitHub } from '../../lib/appwrite'
import { toast } from "../../lib/toast";
import { AppwriteException } from 'appwrite'

const webClientId = '126322592094-q0ohnm26i6hq2cmul4so60k2igo1nen9.apps.googleusercontent.com'
const iosClientId = '126322592094-meu1b8m3vup4mhfdufehsdbcsf0t88eu.apps.googleusercontent.com'
const androidClientId = '126322592094-6ulbqa6oaecn489qfuj7cbjcg9c25bph.apps.googleusercontent.com'

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext()
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  
const config = {
  webClientId,
  iosClientId,
  androidClientId,
}


const submit = async () => {
  
    if ( !form.email || !form.password) {
      return Alert.alert("Error", "Please fill in all the fields")
    }
    setIsSubmitting(true)
    
    try {
    await signIn(form.email, form.password)

    const result = await getCurrentUser();

    setUser(result)
  
    setIsLoggedIn(true)

    toast('Welcome back. You are logged in');

    router.push("/home")

  } catch(error) {
    if (error instanceof AppwriteException) {
      if (error.type === 'user_not_found') {
        Alert.alert("Error", "User not found. Please check your credentials.")
      }
    } 
}
    finally { 
      setIsSubmitting(false)
    }

}

  return (
    <SafeAreaView className="flex-1 bg-white px-5">
      <ScrollView showsVerticalScrollIndicator="false">
      <View>
            <View>

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
              containerStyle="w-[100%] mt-8"
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

        <TouchableOpacity onPress={ async () => {}}  className='border border-gray-300 rounded-full py-3 mb-4 w-full flex-row items-center justify-center'>
            <Image source={icons.google} resizeMode='contain' className='w-6 h-6 mr-2' />
            <Text className='text-gray-600 font-pmedium'>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={ async () => {await SignInWithFacebook()}} className='border border-gray-300 rounded-full py-3 mb-4 w-full flex-row items-center justify-center'>
        <Image source={icons.facebook} resizeMode='contain' className='w-7 h-7 mr-2 -ml-3' />
        <Text className='text-gray-600 font-pmedium'>Continue Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={async () => await SignInWithGitHub()} className='border border-gray-300 rounded-full py-3 mb-4 w-full flex-row items-center justify-center'>
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