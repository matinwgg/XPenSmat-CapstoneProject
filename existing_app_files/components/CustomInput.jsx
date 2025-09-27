import { Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React, {useState} from 'react'
import { icons } from '../constants'

const CustomInput = ({ value, placeholder, handleChangeText, otherStyles, ...props}) => {

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <View className="border border-gray-600 min-h-[50px] min-w-[325px] rounded-[20px] focus:shadow-[#52A8EC]">
        <TextInput 
            className="flex-1 pl-3 h-[50px] text-base"
            value={value}
            placeholder={placeholder}
            placeholderTextColor='#7B7B8B'
            onChangeText={handleChangeText}
            spellCheck={false}
            textContentType={props.contentType}
        />
 
      </View>
    </View>
  )
}

export default CustomInput