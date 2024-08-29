import React, {useState} from 'react';
import { Text, View, KeyboardAvoidingView, Image, ScrollView, Alert } from 'react-native';
import { icons, images } from '../../constants'
import { Link, router } from 'expo-router';
import CustomButton from '../../components/CustomButton'
import FormField from '../../components/FormField';
import { recoverPwd } from '../../lib/appwrite';
//import { useGlobalContext } from '../../context/GlobalProvider'
import { updateNewPassword, userId, secret } from '../../lib/local-server/controllers/auth_controllers';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function ResetPassword () {
  //const { user } = useGlobalContext()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const route = useRoute();
    const navigation = useNavigation();
  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    
    const [form, setForm] = useState({
      newPwd: "",
      retypePwd: ""
    })

    const { userId, secret } = route.params;

    const submit = async () => {
      try {
        if (form.newPwd !== form.retypePwd) {
          return Alert.alert("Error", "Passwords do not match")
          //router.push('/sign-in')
        } 
        if (form.newPwd.length < 8) {
          Alert.alert("Error", "Password must be at least 8 characters.");
          return;
        }
      await recoverPwd.updatePassword(userId, secret, form.newPwd, form.retypePwd)
      } catch (error) {
        Alert.alert("Error", "An unexpected error occurred.");
      }
      
    }

    return (
      <KeyboardAvoidingView className="bg-gray flex-1 min-h-[100vh]">
        <ScrollView showsVerticalScrollIndicator="false"  keyboardShouldPersistTaps='handled'>
        <View className="p-5">
            <Link href="/forgot" className='mt-[50px]'>
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
                  value={form.newPassword}
                  containerStyle="w-[340px]"
                  placeholder={'Password'}
                  onChangeText={(e) => setForm({ ...form, newPwd: e })}
                  error={passwordError}
                  secureTextEntry
              />

              <FormField
                value={form.retypePwd}
                  containerStyle="w-[340px] mt-5"
                  placeholder={'Confirm Password'}
                  onChangeText={(e) => setForm({ ...form, retypePwd: e })}
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
             handlePress={submit}
            />
          </View>
        </View>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

