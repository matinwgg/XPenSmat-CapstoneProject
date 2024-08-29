import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const categories = [
  { label: 'Groceries', value: 'Groceries' },
  { label: 'Rent', value: 'Rent' },
  { label: 'Salary', value: 'Salary' },
  { label: 'Freelancing', value: 'Freelancing' },
  { label: 'Utilities', value: 'Utilities' },
  { label: 'Electronics', value: 'Electronics' },
  { label: 'Dining Out', value: 'Dining Out' },
  { label: 'Breakfast Supplies', value: 'Breakfast Supplies' },
  { label: 'Household Items', value: 'Household Items' },
  { label: 'Christmas Gifts', value: 'Christmas Gifts' },
  { label: 'New Year Party Supplies', value: 'New Year Party Supplies' },
  { label: 'Thanksgiving Groceries', value: 'Thanksgiving Groceries' },
  { label: 'Bonus', value: 'Bonus' },
  { label: 'Consulting Work', value: 'Consulting Work' },
  { label: 'Part-Time Job', value: 'Part-Time Job' },
  { label: 'Online Sales', value: 'Online Sales' },
  { label: 'Freelance Writing', value: 'Freelance Writing' },
  { label: 'End of Year Bonus', value: 'End of Year Bonus' },
  { label: 'Thanksgiving Freelance', value: 'Thanksgiving Freelance' },
  { label: 'Education', value: 'Education' },
  { label: 'Food', value: 'Food' },
  { label: 'Medical', value: 'Medical' },
  { label: 'Social Event', value: 'Social Event' },
  { label: 'Shopping', value: 'Shopping' },
];

const transactionTypeData = [
  { label: 'Expense', value: 'Expense' },
  { label: 'Income', value: 'Income' },
];

const paymentData = [
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

const DropdownComponent = ({paymentMode, transactionType, placeholder, Category,setCategory}) => {
  
  const [isFocus, setIsFocus] = useState(false);
  const dynamicPlaceholder = transactionType === "Income" ? "Enter Source of Income" : placeholder;
  const [ data, setData ] = useState("paymentData")
  const selectedData = paymentMode
    ? paymentData
    : Category
    ? categories
    : transactionTypeData;
    
  return (
    <View>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: '#fff' }, paymentMode && { height: 55 }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={selectedData}
        maxHeight={200}
        containerStyle={[styles.container,{backgroundColor:"#FFF", borderRadius: 15}]}
        itemTextStyle={{color:"#000", fontFamily: 'Poppins-Regular'}}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? dynamicPlaceholder : ''}
        searchPlaceholder="Search..."
        value={Category}
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
    fontFamily: 'Poppins-Regular',
    color: "#9DA0A7"
  },
  
  selectedTextStyle: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    paddingLeft: 11,
  },

  

});