import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';


const data = [
  { label: 'Education', value: 'Education' },
  { label: 'Food', value: 'Food' },
  { label: 'Medical', value: 'Medical' },
  { label: 'Rent', value: 'Rent' },
  { label: 'Social Event', value: 'Social Event' },
  { label: 'Shopping', value: 'Shopping' },
  { label: 'Miscelleneous', value: 'Miscelleneous' },
  
];

const mode = [
  { label: 'Wallet', value: 'wallet'},
  { label: 'Momo', value: 'Mobile payment'},
  { label: 'ATMoney', value: 'Mobile payment'},
  { label: 'Bank transfer', value: 'bank transfer'},
  { label: 'cash', value: 'cash'},
  { label: 'cheque', value: 'cheque'},
  { label: 'paypal', value: 'paypal'},
  { label: 'crytocurrency', value: 'crytocurrency'},
  { label: 'Apple Pay', value: 'apple pay'},


];

const DropdownComponent = ({payment, placeholder, category,setCategory}) => {

  const [isFocus, setIsFocus] = useState(false);


  return (
    <View>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: '#fff' }, payment && { height: 55 }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={payment ? mode : data}
        maxHeight={200}
        containerStyle={[styles.container,{backgroundColor:"#FFF", borderRadius: 15}]}
        itemTextStyle={{color:"#000", fontFamily: 'Brighter-Regular'}}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? placeholder : ''}
        searchPlaceholder="Search..."
        value={category}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setCategory(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    height: 55,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 8,
    marginHorizontal: 8,
    marginRight:0,
    marginTop:10,
    backgroundColor:"#fff" 
  },
  icon: {
    marginRight: 8,
  },

  placeholderStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 3,
    fontFamily: 'Brighter-Regular',
  },
  
  selectedTextStyle: {
    fontSize: 20,
    fontFamily: 'Brighter-Regular',
    paddingLeft: 11,
  },

  

});