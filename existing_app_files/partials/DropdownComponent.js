import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const incomeCategories = [
  { label: 'please specify', value: 'none' },
  { label: 'Salary/Wages', value: 'Salary/Wages' },
  { label: 'Freelancing/Consulting', value: 'Freelancing/Consulting' },
  { label: 'Business Income', value: 'Business Income' },
  { label: 'Investments', value: 'Investments' },
  { label: 'Real Estate', value: 'Real Estate' },
  { label: 'Royalties', value: 'Royalties' },
  { label: 'Online Sales', value: 'Online Sales' },
  { label: 'Part-Time Jobs', value: 'Part-Time Jobs' },
  { label: 'Side Gigs', value: 'Side Gigs' },
  { label: 'Bonuses', value: 'Bonuses' },
  { label: 'Pensions/Retirement Funds', value: 'Pensions/Retirement Funds' },
  { label: 'Government Benefits', value: 'Government Benefits' },
  { label: 'Grants/Scholarships', value: 'Grants/Scholarships' },
  { label: 'Affiliate Marketing', value: 'Affiliate Marketing' },
  { label: 'Crowdfunding', value: 'Crowdfunding' },
  { label: 'Peer-to-Peer Lending', value: 'Peer-to-Peer Lending' },
  { label: 'Inheritance', value: 'Inheritance' },
  { label: 'Gifts/Donations', value: 'Gifts/Donations' },
  { label: 'Dividends', value: 'Dividends' },
  { label: 'Stock Market Trading', value: 'Stock Market Trading' },

];
const expenseCategories = [
  { label: 'please specify', value: 'none' },
  { label: 'Groceries', value: 'Groceries' },
  { label: 'Rent', value: 'Rent' },
  { label: 'Salary', value: 'Salary' },
  { label: 'Freelancing', value: 'Freelancing' },
  { label: 'Utilities', value: 'Utilities' },
  { label: 'Electronics', value: 'Electronics' },
  { label: 'Dining Out', value: 'Dining Out' },
  { label: 'Breakfast Supplies', value: 'Breakfast Supplies' },
  { label: 'Household Items', value: 'Household Items' },
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
  { label: 'Transportation', value: 'bus-outline' },
  { label: 'Health', value: 'medkit-outline' },
  { label: 'Entertainment', value: 'film-outline' },
  { label: 'Dining', value: 'restaurant-outline' },
  { label: 'Utilities', value: 'flash-outline' },
  { label: 'Insurance', value: 'shield-checkmark-outline' },
  { label: 'Fitness', value: 'fitness-outline' },
  { label: 'Investments', value: 'trending-up-outline' },
  { label: 'Gifts', value: 'gift-outline' },
  { label: 'Donations', value: 'heart-outline' },
  { label: 'Loans', value: 'wallet-outline' },
  { label: 'Savings', value: 'piggy-bank-outline' },
  { label: 'Subscriptions', value: 'newspaper-outline' },
  { label: 'Phone', value: 'call-outline' },
  { label: 'Internet', value: 'wifi-outline' },
  { label: 'Clothing', value: 'shirt-outline' },
  { label: 'Beauty', value: 'rose-outline' },
  { label: 'Personal Care', value: 'body-outline' },
  { label: 'Childcare', value: 'baby-outline' },
  { label: 'Pets', value: 'paw-outline' },
  { label: 'Cleaning', value: 'broom-outline' },
  { label: 'Home Maintenance', value: 'construct-outline' },
  { label: 'Repairs', value: 'hammer-outline' },
  { label: 'Furniture', value: 'bed-outline' },
  { label: 'Electronics', value: 'laptop-outline' },
  { label: 'Books', value: 'book-outline' },
  { label: 'Music', value: 'musical-notes-outline' },
  { label: 'Movies', value: 'videocam-outline' },
  { label: 'Games', value: 'game-controller-outline' },
  { label: 'Software', value: 'code-outline' },
  { label: 'Hobbies', value: 'color-palette-outline' },
  { label: 'Toys', value: 'cube-outline' },
  { label: 'Events', value: 'calendar-outline' },
  { label: 'Charity', value: 'hand-heart-outline' },
  { label: 'Memberships', value: 'card-outline' },
  { label: 'Business', value: 'briefcase-outline' },
  { label: 'Freelance', value: 'document-outline' },
  { label: 'Side Jobs', value: 'hammer-outline' },
  { label: 'Bonus', value: 'trophy-outline' },
  { label: 'Freight', value: 'train-outline' },
  { label: 'Taxis', value: 'car-outline' },
  { label: 'Ride Sharing', value: 'car-sport-outline' },
  { label: 'Public Transport', value: 'subway-outline' },
  { label: 'Fuel', value: 'gas-outline' },
  { label: 'Parking', value: 'stop-outline' },
  { label: 'Car Maintenance', value: 'car-wash-outline' },
  { label: 'Tolls', value: 'road-outline' },
  { label: 'Bicycles', value: 'bicycle-outline' },
  { label: 'Motorcycles', value: 'motorcycle-outline' },
  { label: 'Flights', value: 'airplane-outline' },
  { label: 'Hotels', value: 'bed-outline' },
  { label: 'Vacation', value: 'umbrella-outline' },
  { label: 'Cruises', value: 'boat-outline' },
  { label: 'Camping', value: 'camp-outline' },
  { label: 'Hiking', value: 'walk-outline' },
  { label: 'Tours', value: 'map-outline' },
  { label: 'Adventure', value: 'planet-outline' },
  { label: 'Photography', value: 'camera-outline' },
  { label: 'Video', value: 'videocam-outline' },
  { label: 'Social Media', value: 'chatbox-outline' },
  { label: 'Streaming', value: 'tv-outline' },
  { label: 'Sports', value: 'football-outline' },
  { label: 'Gym', value: 'barbell-outline' },
  { label: 'Yoga', value: 'flower-outline' },
  { label: 'Cycling', value: 'bicycle-outline' },
  { label: 'Running', value: 'walk-outline' },
  { label: 'Swimming', value: 'water-outline' },
  { label: 'Martial Arts', value: 'fist-outline' },
  { label: 'Boxing', value: 'glove-outline' },
  { label: 'Fishing', value: 'fish-outline' },
  { label: 'Hunting', value: 'disc-outline' },
  { label: 'Diving', value: 'disc-outline' },
  { label: 'Skiing', value: 'snow-outline' },
  { label: 'Surfing', value: 'wave-outline' },
  { label: 'Boating', value: 'boat-outline' },
  { label: 'Sailing', value: 'boat-outline' },
  { label: 'Horse Riding', value: 'horse-outline' },
  { label: 'Archery', value: 'disc-outline' },
  { label: 'Shooting', value: 'disc-outline' },
  { label: 'Wrestling', value: 'body-outline' },
  { label: 'Basketball', value: 'basketball-outline' },
  { label: 'Baseball', value: 'baseball-outline' },
  { label: 'Soccer', value: 'football-outline' },
  { label: 'Golf', value: 'golf-outline' },
  { label: 'Tennis', value: 'tennisball-outline' },
  { label: 'Rugby', value: 'american-football-outline' },
  { label: 'Volleyball', value: 'volleyball-outline' },
  { label: 'Cricket', value: 'cricket-outline' },
  { label: 'Racing', value: 'flag-outline' },
  { label: 'Concerts', value: 'mic-outline' },
  { label: 'Theater', value: 'people-outline' },
  { label: 'Festivals', value: 'disc-outline' },
  { label: 'Parties', value: 'wine-outline' },
  { label: 'Exhibitions', value: 'color-palette-outline' }
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

const DropdownComponent = ({paymentMode, transactionType, Category, placeholder, value,setValue}) => {
  
  const [isFocus, setIsFocus] = useState(false);
  
  const selectedData = paymentMode 
  ? paymentData 
  : Category 
  ? (Category === 'Expense' ? expenseCategories : incomeCategories) 
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
        placeholder={!isFocus ? placeholder : ''}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
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