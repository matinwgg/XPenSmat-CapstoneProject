import React from 'react';
import { Text, View, ActivityIndicator, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';

const { height } = Dimensions.get("window");

import Spacing from "../constants/spacing";
import Colors from "../constants/colors";

const CustomButton = ({title, isLoading, handlePress, containerStyles, type = "PRIMARY", otherStyles, textStyles }) => {

    return (

        <TouchableOpacity onPress={handlePress} className={`w-[100%] h-[48px] ${containerStyles} ${isLoading ? 'opacity-50' : '' } ${type === 'PRIMARY' ? '' : 'bg-white'} ${otherStyles}`} style={styles.container}>
            {isLoading == true ? (
                <ActivityIndicator size="small" color='#FFF' />
            ) : (
                <Text className={`text-center text-white font-mbold text-lg ${textStyles}`}>
                    {title}
                </Text>
            )}        
        
        </TouchableOpacity>

        // <TouchableOpacity
        //     onPress={handlePress}
        //     className={`border-2 rounded-[25px] w-[100%] h-[48px]  justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : '' } ${type === 'PRIMARY' ? '' : 'bg-white'} ${otherStyles}`}
        //     >

        //     {isLoading == true ? (
        //         <ActivityIndicator size="small" color='#25d366' />
        //     ) : (
        //         <View className="items-center rounded-[25px] w-[100%] h-[48px]">
        //             <Text className={`text-black font-psemibold text-lg p-3 ${textStyles}`}>
        //                 {title}
        //             </Text>
        //         </View>
        //     )}
            
        // </TouchableOpacity>
   
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.primary,
        paddingVertical: Spacing * 1.5,
        paddingHorizontal: Spacing * 2,
        width: "100%",
        borderRadius: Spacing,
        shadowColor: Colors.primary,
        shadowOffset: {
        width: 0,
        height: Spacing,
        },
        shadowOpacity: 0.2,
        shadowRadius: Spacing,
    },
    
})

export default CustomButton;



// 23CE6B