import { ScrollView, Alert, StyleSheet, Text, View, TouchableOpacity, Image, Platform } from 'react-native'
import React, {useEffect, useState, useRef} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../constants'
import FormField from '../../components/FormField'
import {Link, router} from 'expo-router'
import CustomButton  from '../../components/CustomButton'
import { useGlobalContext } from '../../context/GlobalProvider'
import { getCurrentUser, signIn, SignInWithGitHub } from '../../lib/appwrite'
import { AppwriteException } from 'appwrite'
import Swiper from "react-native-swiper";
import RBSheet from 'react-native-raw-bottom-sheet';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { onboarding } from "../../constants/onboarding";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext()
  const [isSubmitting, setIsSubmitting] = useState(false);

  const swiperRef = useRef(null);
  const sheetRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === onboarding.length - 1;

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const goto = () => {
    sheetRef.current.close()
    //router.replace('/sign-up')
    }

const submit = async () => {
    if ( !form.email || !form.password) {
      return Alert.alert("Error", "Please fill in all the fields")
    } else if (!(emailRegex.test(form.email))) { 
      return Alert.alert("Invalid email", "Please enter a valid email")
    } else if (form.password.length < 8) { 
      return Alert.alert("Incorrect password", "Please enter a correct password")
    } 

    setIsSubmitting(true)
    try {
      const session = await signIn(form.email, form.password);

       // If signIn returns null, the sign-in failed
      if (!session) {
        return Alert.alert(
            "Invalid user credentials",
            "Please check and re-enter your correct username and password"
        );
      }
      const result = await getCurrentUser();  // Get the current user's details
      // If no user is found, handle the case
      if (!result) {
        return Alert.alert( "Invalid user credentials", "Please check and re-enter your correct username and password")
      }
      // User is successfully logged in
      setUser(result)
      setIsLoggedIn(true)

      Alert.alert("Success", "User signed in successfully");
      router.push("/home");
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
  useEffect(() => {
    sheetRef.current.open()
  }, [])

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

        <TouchableOpacity onPress={ async () => {}}  className='border border-gray-300 rounded-full py-3 mb-5 w-full flex-row items-center justify-center'>
            <Image source={icons.google} resizeMode='contain' className='w-6 h-6 mr-2' />
            <Text className='text-gray-600 font-pmedium'>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={async () => await SignInWithGitHub()} className='border border-gray-300 rounded-full py-2.5 mb-4 w-full flex-row items-center justify-center'>
        <Image source={icons.github} resizeMode='contain' className='w-7 h-7 mr-2 -ml-1' />
        <Text className='text-gray-600 font-pmedium'>Continue with GitHub</Text>
      </TouchableOpacity>


            <View className="flex-row self-center mt-8">
                <Text className="font-pmedium ">Don't have an account? </Text>
                <TouchableOpacity
                  onPress={() => router.push('/sign-up')}>
                    <Text className="font-pbold text-[#0161C7]">Sign up</Text> 
                </TouchableOpacity>
            </View>
           
            </View>
      </View>
      <RBSheet
        ref={sheetRef}
        height={360}
        openDuration={150}
        closeDuration={100}
        customStyles={{
         // wrapper: {backgroundColor: 'transparent'},
         container: { borderTopLeftRadius: 0, borderTopRightRadius: 20, }
        }}>

          <View className="self-end mt-2.5 mr-2">
          <TouchableOpacity onPress={() => { sheetRef.current.close()}}>
              <FeatherIcon
                color="#000"
                name="x"
                style={{
                  alignSelf: 'center',
                }}
                size={24} />
            </TouchableOpacity>
          </View>

           {/* <FeatherIcon
              color="#2b64e3"
              name="shield"
              style={{
                alignSelf: 'center',
              }}
              size={48} />
       
          <Text className="text-[18px] font-pbold text-[#181818] mt-4 text-center">Track Your Expenses</Text>

          <Text className="text-[14px] font-pmedium text-[#555] mt-4 text-center">
            Stay on top of your finances by effortlessly recording every expense, 
            big or small. Whether it's your morning coffee or monthly rent, our 
            app makes it simple to log all your transactions in one place, 
            helping you maintain a clear and accurate record of where your money goes each day.
          </Text> */}
          
          <Swiper
            ref={swiperRef}
            loop={false}
            dot={
              <View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full" />
            }
            activeDot={
              <View className="w-[32px] h-[4px] mx-1 bg-[#0286FF] rounded-full" />
            }
            onIndexChanged={(index) => setActiveIndex(index)}
          >
           
          {onboarding.map((item) => (
              <View key={item.id} className="flex items-center justify-center p-5">
                <Image
                  source={item.image}
                  className="h-10 w-10"
                  resizeMode="contain"
                />
                <View className="flex flex-row items-center justify-center w-full">
                  <Text className="text-[18px] font-pbold text-[#181818] mt-4 text-center">
                    {item.title}
                  </Text>
                </View>
                <Text className="text-[14px] font-pmedium text-[#555] text-center">
                  {item.description}
                </Text>
              </View>
            ))}
          
          </Swiper>

      <View className="w-80 self-center">
        <CustomButton
          title={isLastSlide ? "Get Started" : "Next"}
          handlePress={() =>
            isLastSlide
              ? goto()
              : swiperRef.current?.scrollBy(1)
          }
          containerStyles="mt-10 mb-5"
        />
      </View>
      </RBSheet>
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