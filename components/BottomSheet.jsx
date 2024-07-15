import DateTimePicker from '@react-native-community/datetimepicker';
import RBSheet from 'react-native-raw-bottom-sheet';
// import BottomSheetContent from '../../components/BottomSheet'
// import FeatherIcon from 'react-native-vector-icons/Feather';
import { Link } from 'expo-router'
// import { icons } from '../../constants/icons'
import Icon from 'react-native-vector-icons/Ionicons';

import {  SafeAreaView, Image, TextInput, View, Text, Button, FlatList, TouchableOpacity, Pressable, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import React, { useState, Component } from 'react';
import MyButton from '../components/CustomButton2';
//import { icons } from '../constants/icons'
import TextField from '../components/TextField';


// class MySheet extends Component {
//   render() {
//   const sheet = React.useRef();

//   const [ date, setDate ] = useState(new Date())
//     const [ showPicker, setShowPicker ] = useState(false)
//     const [dateOfPurchase, setDateOfPurchase] = useState("")

//     const toggleDatePicker = () => {
//         setShowPicker(!showPicker)
//     }

//     const onChange = ({ type }, selectedDate) => {
//         if  (type == "set") {
//             const currentDate = selectedDate
//             setDate(currentDate)

//             if (Platform.OS === "android") {
//                 toggleDatePicker()
//                 setDateOfPurchase(currentDate.toDateString())
//             }
//         } else {
//             toggleDatePicker()
//         }
//     }

//   React.useEffect(() => {
//     sheet.current.open();
//   }, []);

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <View>
//         <SheetContent />
//       </View>
//     <RBSheet
//       customStyles={{ container: styles.container }}
//       height={400}
//       openDuration={250}
//       ref={ref => {
//         this.RBSheet = ref;
//       }}>
//       <View style={styles.sheetContent}>

//       {/* <View>
//             <Link href="/home" className=''>
//               <FeatherIcon
//               color="#2b64e3"
//               name="shield"
//               style={{
//                 alignSelf: 'center',
//               }}
//               size={48} />

//             </Link>
//           </View> */}

//             <DateTimePicker 
//               mode='date'
//               display="spinner"
//               value={date}
//               onChange={onChange}
//               className="h-[120px] -mt-2.5"

//             />

//         <TouchableOpacity
//           onPress={() => {
//             // handle onPress
//           }}>
//           <View style={styles.btn}>
//             <Text style={styles.btnText}>Confirm</Text>
//           </View>
//         </TouchableOpacity>

//         <View style={styles.spacer} />

//         <TouchableOpacity
//           onPress={() => sheet.current.close()}>
//           <View style={styles.btnSecondary}>
//             <Text style={styles.btnSecondaryText}>Cancel</Text>
//           </View>
//         </TouchableOpacity>
//       </View>
//     </RBSheet>
//     </SafeAreaView>
// );
// }
// }




const SheetContent = () => {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    date: "",
    category: "",
  })
  const [categoryId, setCategoryId] = useState(null);
  
  const [ date, setDate ] = useState(new Date())
    const [ showPicker, setShowPicker ] = useState(false)
    const [dateOfPurchase, setDateOfPurchase] = useState("")

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

  const categories = [
    {'id': 1, 'title': 'Household', 'color': 'blue'},
    {'id': 2, 'title': 'Food', 'color': 'blue'},
    {'id': 3, 'title': 'Subscription', 'color': 'blue'},
    {'id': 4, 'title': 'Pet', 'color': 'blue'},
    {'id': 5, 'title': 'Wellness', 'color': 'blue'},
    {'id': 6, 'title': 'Entertainment', 'color': 'blue'},
  ]


  return (

    <View className="mx-3 mt-5 mb-3">

      <View className="flex-auto">
        <TextField
          value={form.name}
          placeholder={'Expense Name'}
          placeholderTextColor="#7B7B8B"
          contentType='name'
          onChangeText={(e) => setForm({...form, name: e})}
          //className="border-collapse border-b-2 border-b-gray-500 w-full"
          //containerStyle="text-5xl border-collapse border-b-2 border-b-gray-500 w-full"
        />
        <TouchableOpacity onPress={() => {}}>
          {/* <Image source={icons.close} resize="contain" className="w-6 h-6 self-end mr-2 -mt-2"/> */}
        </TouchableOpacity>
      </View>
      
      <TextField 
        value={form.amount}
        placeholder={'Amount'}
        placeholderTextColor="#7B7B8B"
        onChangeText={(e) => setForm({...form, amount: e})}
        // className="border-collapse border-b-2 border-b-gray-500"
        keyType='decimal-pad'
        containerStyle="mt-10"

      />
  
  {!showPicker && (
      <Pressable>
      <View className=" flex-row mt-9">
        <TextField
          value={form.date}
          placeholder='Date'
          placeholderTextColor=""
          onChangeText={(e) => setForm({...form, date: e})}
          containerStyle=" border-collapse border-b-gray-200 w-[95%]"
          //containerStyle=""

        />
        <MyButton 
          text="set date"
          onPress={() => {
            this.RBSheet.open();
          }}
          //className="border border-collapse"
          containerStyles="w-40 -ml-[124px] mt-[2px]"
           otherStyles="font-mbold text-lg"
           fgColor="#4CAF50"
           type="SECONDARY"

        />
      </View>
      </Pressable>
    )}

    <View className="mt-2 pl-2">
      
          {/* FlatList is used to prevent the following warning:
          VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.  */}
          <FlatList
            ListHeaderComponent={(
                <><View
              style={{
                marginVertical: 10,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>

            </View>
              <Text className="font-pextrabold">
                Select Categories

              </Text></>
              )}
            numColumns={3}
            data={categories}
            keyExtractor={item => item.id}
            columnWrapperStyle={{flex: 1, justifyContent: 'space-evenly'}}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setCategoryId(item.id)}
                className={`bg-[#dcdcdc] border-[#dcdcdc] h-7 w-[${item.title.length}] `}
                style={[
                  styles.categoryBox,
                  //{borderColor: item.color},
                  //categoryId === item.id && {backgroundColor: item.color},
                ]}>
                {/* {item.title.length > 10 ? (
                  <Text style={styles.categoryText}>
                    {item.title.slice(0, 8) + '...'}
                  </Text>
                ) : (
                  <Text style={styles.categoryText}>{item.title}</Text>
                )} */}
                 <Text className="font-mbold pt-1.5 text-center px-5">{item.title}</Text>
              </TouchableOpacity>
            )}
            />


   
  </View>
  <MyButton 
       text="Add Expense"
       onPress={() => {}}
       //isLoading={}
        otherStyles=" font-mbold text-xl rounded-[10px] self-center  justify-center"
        bgColor="#4CAF50"
        containerStyles="w-[90%] self-center items-center  rounded-[15px]"
      />
  </View>

  )
};

export default SheetContent


const styles = StyleSheet.create({
container: {
  borderTopLeftRadius: 14,
  borderTopRightRadius: 14,
},
sheetContent: {
  paddingTop: 24,
  paddingHorizontal: 5,
  alignItems: 'stretch',
},
title: {
  fontSize: 18,
  fontWeight: '600',
  color: '#181818',
  marginTop: 16,
  textAlign: 'center',
},
message: {
  fontSize: 14,
  fontWeight: '400',
  color: '#555',
  marginTop: 16,
  marginBottom: 32,
  textAlign: 'center',
},
spacer: {
  marginBottom: 12,
},
/** Placeholder */
placeholder: {
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: 0,
  height: 400,
  marginTop: 0,
  padding: 24,
  backgroundColor: 'transparent',
},
placeholderInset: {
  borderWidth: 4,
  borderColor: '#e5e7eb',
  borderStyle: 'dashed',
  borderRadius: 9,
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: 0,
},
/** Button */
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
  categoryBox: {
    borderRadius: 5,
    marginVertical: 5,
    //width: 100,
  },

});

