import React, {useEffect, useRef, useState} from 'react';
import { Drawer } from 'expo-router/drawer'
//import DropdownList from '../../../../components/DropdownField'
import DropdownComponent from '../../../../partials/DropdownComponent';
import DateTimePicker from '@react-native-community/datetimepicker'
import RBSheet from 'react-native-raw-bottom-sheet';

import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Text,
  Button,
  Animated,
} from 'react-native';

import TextField from '../../../../components/TextField'
import MyButton from '../../../../components/CustomButton2'
import CustomButton from '../../../../components/CustomButton';

const AddExpense = () => {
  const sheet = useRef();

  const [expenseName, setExpenseName] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [ dateOfPurchase, setDateOfPurchase] = useState("")

  const [ date, setDate ] = useState(new Date())
  const [ showPicker, setShowPicker ] = useState(false)

  const [formReady, setFormReady] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)  

  const onSubmit = () => {
    if (!expenseName || !amount || !category || !dateOfPurchase) {
      return Alert.alert('Error', 'Please fill in all the fields')
    }
  }

  const togglePicker = () => {
    setShowPicker(!showPicker)
  }

  const onChange = ({type}, selectedDate) => {
    if (type == 'set') {
      setDate(selectedDate)
    } else {
      togglePicker()
    }
  }

  const onFocus = () => {
    const labelPosition = useRef(new Animated.Value(selectedDate ? 1 : 0)).current;
    labelPosition.interpolate({inputRange: [0, 1], outputRange: [18, -15]})
  }

  useEffect(() => {
    setFormReady(expenseName && amount && dateOfPurchase && category);

    return () => {
      setFormReady(false)
    }
  }, [expenseName, amount, category, dateOfPurchase])


  return (
    <>
    <Drawer.Screen 
      options={{
        headerShown: false,
        gestureEnabled: false,      
    }}/>
    <ScrollView>
    <View className="mx-1 mt-20">
    <Text className="text-center font-mbold text-4xl text-[#0161C7] mt-5">Add Transaction</Text>
      <View className="mx-3 mt-10">

        <View className="flex-auto">
          <TextField
            value={expenseName}
            placeholder={'Expense Name'}
            placeholderTextColor="#7B7B8B"
            contentType='name'
            onChangeText={setExpenseName}
            //className="border-collapse border-b-2 border-b-gray-500 w-full"
            //containerStyle="text-5xl border-collapse border-b-2 border-b-gray-500 w-full"
          />

        </View>

        <TextField 
          value={amount}
          placeholder={'Amount'}
          placeholderTextColor="#7B7B8B"
          onChangeText={setAmount}
          // className="border-collapse border-b-2 border-b-gray-500"
          keyType='decimal-pad'
          containerStyle="mt-8"

        />

      <RBSheet
        height={270}
        openDuration={150}
        closeDuration={150}
        ref={sheet}>

        <View style={styles.sheetContent}>

          <View style={styles.dateHeaderContainer}>
              <TouchableOpacity
                      onPress={() => sheet.current.close()}
                  style={styles.dateHeaderButton}>
                  <Text style={styles.dateHeaderButtonCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  onPress={() => sheet.current.close() }
                  style={[styles.dateHeaderButton]}>
                  <Text style={styles.dateHeaderButtonDone}>Done</Text>
              </TouchableOpacity>
          </View>
            <DateTimePicker 
                mode={"date"}
                display={"spinner"}
                value={date}
                onChange={onChange}
        />
        </View>
      </RBSheet>
       

      {/* Date Picker IOS */}
        <View className="flex-row w-full my-6">
            <TextField
              value={dateOfPurchase}
              placeholder='Date'
              //editable={false}
              onChangeText={setDateOfPurchase}
              containerStyle="bg-white w-[330px] h-[55px] self-center rounded-[20px]"
             />

            <TouchableOpacity onPress={() => sheet.current.open()} className="items-center justify-center absolute">
              <Text className="ml-[270px] mt-5">set date</Text>
            </TouchableOpacity>
      </View>
        
        <View> 
          <DropdownComponent category="" setCategory={setCategory}/>
        </View>

        

        <View>
          <CustomButton 
          title="Add Expense"
          onPress={onSubmit}
          isLoading={isSubmitting}
          disabled={!formReady}
          containerStyles="w-[90%] self-center items-center mt-[90px]"
          />
        </View>

</View>


    </View>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  containerSheet: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  textTitle: {
    fontSize: 20,
    marginTop: 120,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  button: {
    width: 150,
    backgroundColor: '#4EB151',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 3,
    margin: 10,
  },
  buttonTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  sheetContent: {
    paddingTop: -5,
    //paddingBottom: 10,
    paddingHorizontal: 5,
    alignItems: 'stretch',
  },

  dateHeaderContainer: {
    height: 40,
    //paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateHeaderButton: {
    height: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateHeaderButtonCancel: {
    fontSize: 18,
    color: '#666',
    fontWeight: '400',
  },
  dateHeaderButtonDone: {
    fontSize: 18,
    color: '#006BFF',
    fontWeight: '500',
  },


btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#2b64e3',
    borderColor: '#2b64e3',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  btnSecondaryText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#2b64e3',
  },
text: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 5,
},
screen: {
    flex: 1,

},
btnText:{
    postion: 'absolute',
    top: 0,
    height: 60,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
},
btnCancel: {
    left: 0
},
btnDone: {
    right: 0,
},
  inputIconSend: {
    color: '#006BFF',
  },
  input: {
    flex: 1,
    height: 36,
    borderRadius: 36,
    paddingHorizontal: 10,
    backgroundColor: '#f1f1f1',
    marginHorizontal: 10,
  },
  messageContainer: {
    flex: 1,
    padding: 25,
  },
  messageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  message: {
    fontSize: 17,
    lineHeight: 24,
    marginVertical: 20,
  },
  messageButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  messageButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#3385ff',
    marginLeft: 10,
  },
  messageButtonText: {
    color: '#3385ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageButtonRight: {
    backgroundColor: '#3385ff',
  },
  messageButtonTextRight: {
    color: '#fff',
  },
});

export default AddExpense;
