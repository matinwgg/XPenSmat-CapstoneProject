import { TouchableOpacity,  SafeAreaView, Platform, StyleSheet, Text, View } from 'react-native'
import React, {useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'



const DatePicker = (props) => {
    const {visible, defaultDate, onDateChange } = props
    const [ date, setDate ] = useState(new Date(defaultDate))
    const [ show, setShow ] = useState(false)
    

    const onChange = (e, selectedDate) => {
        setDate(new Date(selectedDate))
    }

    const onAndroidChange = (e, selectedDate) => {
        setShow(false)
        if(selectedDate) {
            setDate(new Date(selectedDate))
        }
    }


    const onCancelPress = () => {
        onDateChange(new Date(date))
        sheet.current.close()
    }

    const onDonePress = () => {
        onDateChange(date)
        setShow(false)
        sheet.current.close()
    }
    React.useEffect(() => {
        sheet.current.open();
      }, []);

        return (
              <View>
                {visible && (
                    <DateTimePicker 
                        display={Platform.OS == "ios" ? "spinner" : 'default'}
                        value={date}
                        mode='date'
                        onChange={onChange}
                />)}
            </View> 
        )

}

export default DatePicker

const styles = StyleSheet.create({
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
    }
})