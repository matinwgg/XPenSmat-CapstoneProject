import { TouchableOpacity, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { TouchableHighlight } from 'react-native'


const DatePicker = (props) => {
    const { defaultDate, onDateChange } = props
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
        setShow(false)
    }

    const onDonePress = () => {
        onDateChange(date)
        setShow(false)
    }

    const renderDatePicker = () => {
        return (
            <>
                <DateTimePicker 
                    display={Platform.OS == "ios" ? "spinner" : 'default'}
                    timeZoneOffsetInMinutes={0}
                    value={new Date(date)}
                    mode='date'
                    minimumDate={new Date(1920, 10, 20)}
                    maximumDate={new Date()}
                    onChange={Platform.OS === 'ios' ? onChange : onAndroidChange}
                />
            </>
        )
    }
  return (
    <Pressable style={styles.box} onPress={() => setShow(true)} activeOpacity={0}>
      <View>
        {Platform.OS === 'ios' && show && renderDatePicker()}

        {Platform.OS == 'ios' && (
            <Modal transparent={false} animationType='slide' visible={show} supportedOrientations={['portrait']} onRequestClose={()=> setShow(!show)}>
                <View style={styles.screen}>
                    <TouchableOpacity underlayColor={'#FFF'} style={styles.pickerContainer}>
                        <View>
                            <View style={{backgroundColor: 'white'}}>
                                <View style={{ marginTop: 20}}>{renderDatePicker()}</View>
                                <TouchableHighlight underlayColor={'transparent'} onPress={onCancelPress} style={[styles.btnText, styles.btnCancel]}>
                                    <Text>Cancel</Text>
                                </TouchableHighlight>

                                <TouchableHighlight underlayColor={'transparent'} onPress={onDonePress} style={[styles.btnText, styles.btnDone]}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold'}}>Done</Text>
                                </TouchableHighlight>
                            </View>
                        </View>

                    </TouchableOpacity>
                </View>
            </Modal>
        )}
      </View>
    </Pressable>
  )
}

export default DatePicker

const styles = StyleSheet.create({
    pickerContainer: {
        backgroundColor: '#FFF',
        width: '100%',
        height: '30%',
        position: 'absolute',
        bottom: 0,
    }, 
    box: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        height: 50,
        paddingVertical: 10,
        backgroundColor: 'white',
        paddingHorizontal: 10,
        borderRadius: 10,
        shadowColor: '#999',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 2,
    
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