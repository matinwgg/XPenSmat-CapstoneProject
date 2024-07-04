import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, Pressable} from 'react-native';

const CustomButton = ({title, handlePress, isLoading, containerStyles, type = "PRIMARY", otherStyles, textStyles }) => {
    return (
        <Pressable disabled={isLoading} onPress={handlePress} className={`h-[40px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : '' } ${type === 'PRIMARY' ? '' : 'bg-white'} ${otherStyles}`}>
            <LinearGradient
                colors={['#25d366', '#25d366', '#25d366']}
                className="items-center rounded-[25px] w-[100%] h-[48px]">
                <Text className={`text-black font-psemibold text-lg p-3 ${textStyles}`}>{title}</Text>
            </LinearGradient>
        </Pressable>
   
    );
};

export default CustomButton;



// 23CE6B