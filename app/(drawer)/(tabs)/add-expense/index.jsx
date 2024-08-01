import React, {useEffect, useRef, useState} from 'react';
import { Drawer } from 'expo-router/drawer'
import DropdownComponent from '../../../../partials/DropdownComponent';
import DateTimePicker from '@react-native-community/datetimepicker'
import RBSheet from 'react-native-raw-bottom-sheet';
import { upLoadExpense } from '../../../../lib/appwrite'

import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Text,
} from 'react-native';

import TextField from '../../../../components/TextField'
import CustomButton from '../../../../components/CustomButton';
import { useGlobalContext } from "../../../../context/GlobalProvider";

const AddExpense = () => {
  const sheet = useRef();
  const { user } = useGlobalContext();

  const [datePlaceholder, setDatePlaceholder] = useState("Date")

  const [ date, setDate ] = useState(new Date())
  const [ showPicker, setShowPicker ] = useState(false)

  const [formReady, setFormReady] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)  


  const [form, setForm] = useState({
    item: "",
    category: "",
    amount: 0.0,
    dateOfPurchase: new Date(),
    paymentMode: "",
  });


  const onSubmit = async () => {
    try {
      if (form.item === "" || !form.amount || form.category === "" || form.dateOfPurchase === "" || form.paymentMode === "") {
        return Alert.alert("Error", "Please fill in all the fields")
      }

    await upLoadExpense(form.item, form.category, parseFloat(form.amount), form.dateOfPurchase, form.paymentMode, user.$id)

    setIsSubmitting(true)
    
    Alert.alert("Success", "Your expense added successfully")

    } catch (error) {
      Alert.alert("Error", error.message)
    } finally {
       setForm({
         item: "",
         category: "",
         amount: null,
         dateOfPurchase: "",
         paymentMode: "",
       })
      setIsSubmitting(false)
    }

  }

  const onChange = ({type}, dateOfPurchase) => {
    if(type=="set") {
      setDate(dateOfPurchase)
    }
  }

 useEffect(() => {
   setFormReady(form.item && form.amount && form.dateOfPurchase && form.category && form.paymentMode);
   return () => {
     setFormReady(false)
   }
 }, [form.item, form.amount, form.category, form.dateOfPurchase, form.paymentMode])


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

         <TextField
            value={form.item}
            placeholder='Expense Name'
            placeholderTextColor="#000"
            handleTextChange={(e) => setForm({...form, item: e})}
            //contentType='name'
          />
        <View className="flex-row mt-8 mr-5">
          <TextField 
            value={form.amount}
            placeholder='Amount'
            placeholderTextColor="#000"
            handleTextChange={(e) => setForm({...form, amount: e})}
            keyType='decimal-pad'
            containerStyle=" w-[50%]"
          />
          <View className="w-[50%] -mt-2.5">
            <DropdownComponent 
              payment
              placeholder='Payment mode'
              category={form.paymentMode} 
              setCategory={(e) => setForm({...form, paymentMode: e})}
              />
            </View>
        </View>

        <View>
            <RBSheet
            height={270}
            openDuration={150}
            closeDuration={140}
            ref={sheet}>

            <View style={styles.sheetContent}>

              <View style={styles.dateHeaderContainer}>
                  <TouchableOpacity
                          onPress={() => sheet.current.close()}
                      style={styles.dateHeaderButton}>
                      <Text style={styles.dateHeaderButtonCancel}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      onPress={() => {
                        setForm({
                          ...form, dateOfPurchase: date.toDateString()
                        })
                        //setDatePlaceholder("")
                        sheet.current.close()
                      }}
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
        </View>

      {/* Date Picker IOS */}
        <View className="flex-row w-full my-6">
            <TextField
              value={form.dateOfPurchase}
              placeholderTextColor="#000"
              placeholder={datePlaceholder}
              editable={false}
              handleTextChange={(e) => setForm({...form, dateOfPurchase: e})}
              containerStyle=" bg-white w-[330px] h-[55px] self-center rounded-[20px]"
             />

            <TouchableOpacity onPress={() => sheet.current.open()} className="items-center justify-center absolute">
              <Text className=" font-mregular text-base ml-[270px] text-[#1F41BB] mt-5">set date</Text>
            </TouchableOpacity>
      </View>
        
        <View> 
          <DropdownComponent 
            category={form.category} 
            placeholder='Enter Category'
            setCategory={(e) => setForm({...form, category: e})}/>
        </View>

        

        <View>
          <CustomButton 
          title="Add Expense"
          handlePress={onSubmit}
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
