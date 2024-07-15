import React, {useRef, useState} from 'react';

import {
  View,
  ScrollView,
  DateTimePicker,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';

import {
  MaterialIcons as MDIcon,
  FontAwesome as FAIcon,
} from '@expo/vector-icons';

import RBSheet from 'react-native-raw-bottom-sheet';
//import data from './list.json';

const App = () => {
  const refStandard = useRef();
  const refScrollable = useRef();
  const refDatePicker = useRef();
  const refInput = useRef();
  const refMessage = useRef();

  const [ date, setDate ] = useState(new Date())

  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>REACT NATIVE RAW BOTTOM SHEET</Text>
      <View style={styles.buttonContainer}>
        
        <TouchableOpacity
          onPress={() => refDatePicker.current.open()}
          style={styles.button}>
          <Text style={styles.buttonTitle}>DATE PICKER</Text>
        </TouchableOpacity>
        
      </View>

      {/* Date Picker IOS */}
      <RBSheet
        ref={refDatePicker}
        onOpen={() => console.log('RBSheet is Opened')}
        onClose={() => console.log('RBSheet is Closed')}>
        <View style={styles.dateHeaderContainer}>
          <TouchableOpacity
            onPress={() => refDatePicker.current.close()}
            style={styles.dateHeaderButton}>
            <Text style={styles.dateHeaderButtonCancel}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => refDatePicker.current.close()}
            style={[styles.dateHeaderButton]}>
            <Text style={styles.dateHeaderButtonDone}>Done</Text>
          </TouchableOpacity>
        </View>
        <DateTimePicker 
          mode='date'
          display="spinner"
          value={date}
          //onChange={onChange}
          //className="h-[120px] -mt-2.5"

          />     
       </RBSheet>

     

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
  listContainer: {
    flex: 1,
    padding: 25,
  },
  listTitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  listButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  listIcon: {
    fontSize: 26,
    color: '#666',
    width: 60,
  },
  listLabel: {
    fontSize: 16,
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    marginBottom: 20,
  },
  gridButtonContainer: {
    flexBasis: '25%',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridIcon: {
    fontSize: 30,
    color: 'white',
  },
  gridLabel: {
    fontSize: 14,
    paddingTop: 10,
    color: '#333',
  },
  dateHeaderContainer: {
    height: 45,
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
  inputContainer: {
    borderTopWidth: 1.5,
    borderTopColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  inputIcon: {
    fontSize: 24,
    color: '#666',
    marginHorizontal: 5,
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

export default App;
