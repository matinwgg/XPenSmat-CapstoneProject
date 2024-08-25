import React, { useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RBSheet from 'react-native-raw-bottom-sheet';

const Profile = () => {
  const sheet = React.useRef();

  const [ date, setDate ] = useState(new Date())
    const [ showPicker, setShowPicker ] = useState(false)
    const [dateOfPurchase, setDateOfPurchase] = useState("")

  React.useEffect(() => {
    sheet.current.open();
  }, []);

  return (
    <SafeAreaView className="mt-40" style={{ flex: 1 }}>
    <RBSheet
      customStyles={{ container: styles.container }}
      height={500}
      openDuration={250}
      ref={sheet}>
      <View style={styles.sheetContent}>

            <DateTimePicker 
              mode='date'
              display="spinner"
              value={date}
              //onChange={onChange}
              className="h-[120px] -mt-2.5"

            />

        <TouchableOpacity
          onPress={() => {
            // handle onPress
          }}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>Confirm</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.spacer} />

        <TouchableOpacity
          onPress={() => sheet.current.close()}>
          <View style={styles.btnSecondary}>
            <Text style={styles.btnSecondaryText}>Cancel</Text>
          </View>
        </TouchableOpacity>
      </View>
    </RBSheet>
  </SafeAreaView>
);
}

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
});

export default Profile
