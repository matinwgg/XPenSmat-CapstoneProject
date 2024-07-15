import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const MyButton = ({onPress, text, type = "PRIMARY", bgColor, fgColor, containerStyles, otherStyles }) => {
    return (
        <TouchableOpacity  onPress={onPress} style={[styles.container, styles[`container_${type}`], bgColor ? {backgroundColor: bgColor} : {}]} className={`${containerStyles}`}>
            <Text  style={[styles.text, styles[`text_${type}`], fgColor ? {color: fgColor} : {}]} className={`${otherStyles}`}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        marginVertical: 5,
        alignItems: 'center',
        borderRadius: 5
    },
    container_PRIMARY: {
        backgroundColor: '#3B71F3',
    },
    container_SEMI_PRIMARY: {
        backgroundColor: '#000',
    },
    container_SECONDARY: {
        borderColor: '#3B71F3',
    },

    container_SEMI_SECONDARY: {
        borderColor: '#000',
    },

    container_TERTIARY: {},

    text: {
        fontWeight: 'bold',
        color: 'white'
    },
    text_SECONDARY: {
        color: '#3B71F3'
    },
    text_TERTIARY: {
        color: 'gray',
    }
});

export default MyButton;