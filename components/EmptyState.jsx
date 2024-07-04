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
        <Text className="font-pmedium text-sm">
          {title}
        </Text>
        <Text className="text-2xl font-psemibold">
          {subtitle}
        </Text>
    </View>
  )
}

export default EmptyState