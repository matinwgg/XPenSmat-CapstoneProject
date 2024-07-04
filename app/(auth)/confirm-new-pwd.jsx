import React from 'react';
import { View, Text, Button, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { images, icons } from '../../constants'
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';


const ConfirmNewPwd = () => {
  const handleBackToLogin = () => {
    router.replace('/sign-in')
  };

  return (
    <SafeAreaView className="flex-1 mx-3 justify-center">
    <View>
      <Image source={icons.approval} className="w-[200px] h-[200px] mb-5 self-center" />
    </View>

    <View className="items-center">
      <Text className="font-mBold mb-3 text-[24px]">Password updated!</Text>
      <Text className="font-mregular text-[16px] text-gray-400 mx-5 mb-7">Your password has been setup successfully</Text>

      <View className="w-[80%] rounded-md overflow-hidden ">
        <CustomButton title="BACK TO SIGN IN" handlePress={handleBackToLogin}/>
      </View>
    </View>
  
  </SafeAreaView>
  );
};


export default ConfirmNewPwd;
