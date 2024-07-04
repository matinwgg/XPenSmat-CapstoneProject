import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Modal, Platform, TouchableHighlight, SafeAreaView, KeyboardAvoidingView, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropdownList from '../../../../components/DropdownField'
import CustomButton from '../../../../components/CustomButton'
import CustomInput from '../../../../components/CustomInput'
import { Drawer } from 'expo-router/drawer'
import { DrawerToggleButton } from '@react-navigation/drawer'
import { AntDesign } from '@expo/vector-icons';



export default function DateTPicker() {
    const [category, setCategory] = useState("")
    const [item, setItem] = useState("")
    const [amount, setAmount] = useState("")
    const [dateOfPurchase, setDateOfPurchase] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)


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
                setDateOfPurchase(formatDate(currentDate))
            }
        } else {
            toggleDatePicker()
        }
    }

    const confirmIOSDate = () => {
      setDateOfPurchase(date.toDateString())
      toggleDatePicker()
    }

    const formatDate = (rawDate) => {
      let date = new Date(rawDate)

      let year = date.getFullYear()
      let month = date.getMonth()
      let day = date.getDate()

      month = month < 10 ? `0${month}` : month
      day = day < 10 ? `0${day}` : day


      return `${day}-${month}-${year}`

    }

    const onSubmit = () => {}

    useEffect(() => {
        setFormReady(category && item && amount && dateOfPurchase)

        return () => {
            setFormReady(false)
        }
    }, [category, item, amount, dateOfPurchase])

    return (
      <>
    <Drawer.Screen 
    className=""
    options={{
      headerShown: false,
      headerLeft: () => <DrawerToggleButton />
    }}/>

        <SafeAreaView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainerStyle}>

                <View className="">
                  <Text className="font-pregular text-[20px] mb-2 self-start">Name of item</Text>
                  <CustomInput />
                </View>

                <View className="mt-8">
                  <Text className="font-pregular text-[20px] mb-2 self-start">Category</Text>
                </View>
                <View className="mt-3">
                <DropdownList placeholder='select category'/>
                </View>

                <View className="mt-3">
                  <Text className="font-pregular text-[20px] mb-2 self-start">Amount</Text>
                  <CustomInput />
                </View>

                
                <View className="mt-3">
                  <Text className="font-pregular text-[20px] mb-2 self-start">Date</Text>
                    {showPicker && (
                        <Modal transparent={true} animationType='slide' visible={showPicker} supportedOrientations={['portrait']} onRequestClose={()=> setShowPicker(!showPicker)}>
                          <View className="flex-1 mt-[120%]">
                              <DateTimePicker 
                                mode='date'
                                display="spinner"
                                testID="dateTimePicker"
                                value={date}
                                minimumDate={new Date('2000-1-1')}
                                maximumDate={new Date('2070-1-1')}
                                onChange={onChange}
                                style={styles.datePicker}
                            />
                        
                        <View className="flex-row justify-around bg-white">
                            <TouchableHighlight underlayColor={'transparent'} onPress={toggleDatePicker} style={[styles.btnText, styles.btnCancel]}>
                                  <Text style={{ fontSize: 16, fontWeight: 'bold'}}>Cancel</Text>
                              </TouchableHighlight>

                              <TouchableHighlight underlayColor={'transparent'} onPress={confirmIOSDate} style={[styles.btnText, styles.btnDone]}>
                                  <Text style={{ fontSize: 16, fontWeight: 'bold'}}>Done</Text>
                              </TouchableHighlight>
                            </View>
                      </View>
                  </Modal>
                )}

                {/* {showPicker && Platform.OS === 'ios' && (
                      <View className="flex-row justify-around">
                        <TouchableOpacity onPress={toggleDatePicker} style={[styles.button, styles.pickerBtn]}>
                            <Text>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={confirmIOSDate}>
                            <Text style={[styles.button]}>Confirm</Text>
                        </TouchableOpacity>

                      </View>
                )} */}
                    
                   {!showPicker && (
                         <Pressable>
                          <View className="flex-row items-center justify-center">
                            <TextInput 
                                //style={styles.input}
                                className="border border-gray-600 min-h-[50px] font-[400] text-xl min-w-[325px] rounded-[20px] focus:shadow-[#52A8EC] pl-3"
                                placeholder='set date'
                                value={dateOfPurchase}
                                onChangeText={setDateOfPurchase} 
                                placeholderTextColor="#11182744"
                                editable={false}
                                onPressIn={toggleDatePicker}
                            />
                         <AntDesign name="calendar" size={24} color="black" className="-ml-10"/>
                         </View>
                     </Pressable>
                   )}
                    </View>
                    
                    {/* <TouchableOpacity disabled={!formReady} className={`self-center h-10 mt-10 ${formReady ? 'bg-[#075985]' : 'bg-[#11182711]'}`}  onPress={onSubmit}>
                        <Text style={[styles.btnText, {color: formReady ? '#fff' : "#11182766"}]}>
                            Submit
                        </Text>
                    </TouchableOpacity>  */}

                    <CustomButton 
                      otherStyles = {`w-full rounded-[20px] self-center h-10 ${formReady ? 'bg-[#075985]' : 'bg-[#11182711]'}`}
                      containerStyles="mt-[130px]"
                      title="Submit"
                    
                    />


                </ScrollView>
        </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: "#F9FAFB"
  },
  contentContainerStyle: {
    padding: 20,
    paddingTop: Platform.OS === "android" ? Constants.statusBarHeight + 50 : 50,
  },
  head: { 
    fontWeight: "500",
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center",
    color: "#111827CC"
  },
  moto: {
    fontWeight: "400",
    fontSize: 15,
    marginBottom: 35,
    textAlign: "center",
    color: "#111827CC"
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 10,
    color: "#111827CC"
  },
  input: {
    backgroundColor: 'transparent',
    height: 50, fontSize: 14,
    fontStyle: 14,
    fontWeight: "500",
    color: "#111827CC",
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#11182711',
    paddingHorizontal: 20,
    marginBottom: 20,

  },
  button: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: "#075985"
  },
  btnText: {
    position: 'absolute',
    fontSize: 14,
    top: 0,
    height: 60,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnCancel: {
    left: 0,
    marginLeft: -10,
},
btnDone: {
    right: 0,
},
  datePicker: {
    height: 120,
    marginTop: -10,
    marginBottom: 10
  }
})