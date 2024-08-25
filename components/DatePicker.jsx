import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Pressable, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native';
import { TextInput } from 'react-native';


export default function DatePicker() {
    const [category, setCategory] = useState("")
    const [item, setItem] = useState("")
    const [amount, setAmount] = useState("")
    const [dateOfPurchase, setDateOfPurchase] = useState("")

    const [formReady, setFormReady] = useState(false);

    const [ date, setDate ] = useState(new Date())
    const [ showPicker, setShowPicker ] = useState(false)

    const toggleDatePicker = () => {
        setShowPicker(!showPicker)
    }

    const onChange = ({ type }, selectedDate) => {
        if  (type == "set") {
            const currentDate = selectedDate
            setDate(currentDate)

            if (Platform.OS === "android") {
                toggleDatePicker()
                setDateOfPurchase(currentDate.toDateString())
            }
        } else {
            toggleDatePicker()
        }
    }
    const onSubmit = () => {}

    useEffect(() => {
        setFormReady(category && item && amount && dateOfPurchase)

        return () => {
            setFormReady(false)
        }
    }, [category, item, amount, dateOfPurchase])

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS == 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={10}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainerStyle}>
                    <View>
                        <Text>Category</Text>
                        <TextInput 
                            style={styles.input}
                            placeholder='jerry jay'
                            value={category}
                            onChangeText={setCategory} 
                        />
                    </View>

                    <View>
                        <Text>Date</Text>

                        {showPicker && (
                            <DateTimePicker 
                            mode='date'
                            display="spinner"
                            value={date}
                            onChange={onChange}
                            className="h-[120px] -mt-2.5"

                            />
                        )}

                   {showPicker && Platform.OS === 'ios' && (
                         <View className="flex-row justify-around">
                            <TouchableOpacity onPress={toggleDatePicker}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={toggleDatePicker}>
                                <Text>Done</Text>
                            </TouchableOpacity>

                         </View>
                   )}
                        
                   {!showPicker && (
                         <Pressable>
                         <TextInput 
                             style={styles.input}
                             placeholder='jerry jay'
                             value={dateOfPurchase}
                             onChangeText={setDateOfPurchase} 
                             placeholderTextColor="#11182744"
                             editable={false}
                             onPressIn={toggleDatePicker}
                         />
                     </Pressable>
                   )}
                    </View>
                    
                    <TouchableOpacity styles={[styles.button, { backgroundColor: formReady ?'#075985' :'#11182711'}]} disabled={!formReady} onPress={onSubmit}>
                        <Text style={[styles.btnText, {solor: formReady ? '#fff' : "#11182766"}]}>
                            Submit
                        </Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}