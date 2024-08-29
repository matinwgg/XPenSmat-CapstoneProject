import {  TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { DrawerActions } from '@react-navigation/native'
import { useNavigation } from 'expo-router'
import FeatherIcon from 'react-native-vector-icons/Feather';

const OnToggleDrawer = ({ appLogo }) => {
    const navigation = useNavigation();

    const onToggle = () => {
        navigation.dispatch(DrawerActions.openDrawer())
    }
  return (
    <View>
        <TouchableOpacity onPress={onToggle}>
        {appLogo ? (
          <Image 
            source={appLogo} 
            className="w-[40px] h-[40px] rounded-[20px]" 
            resizeMode="contain"
          />
        ) : (
          <FeatherIcon
            color="#2b64e3"
            name="align-left"
            size={24}
          />
        )}
        </TouchableOpacity>
    </View>
  )
}

export default OnToggleDrawer