import {  Text, View, Image } from 'react-native'
import React from 'react'
import { images } from '../constants'

const EmptyState = ({title, subtitle}) => {
  return (
    <View className="justify-center items-center ">
        <Image 
            source={images.empty} className="w-[270px] h-[215px]"
            resizeMode='contain'
        />
        <Text className="font-pmedium text-xl text-center mt-2">
          {title}
        </Text>
        <Text className="text-sm font-psemibold">
          {subtitle}
        </Text>
    </View>
  )
}

export default EmptyState