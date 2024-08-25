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