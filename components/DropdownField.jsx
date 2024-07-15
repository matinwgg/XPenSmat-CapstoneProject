import React, {useState} from 'react';
import { View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';


const data = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },

]

const DropdownList = ({placeholder}) => {
  const [value, setValue] = useState([]);
  const [isFocus, setIsFocus] = useState(false);

  return (
      <View className="mr-4">
        <Dropdown
          className={`font-mregular h-[55px] w-[325px] self-center bg-white border border-gray-200 rounded-[20px] px-2 -mr-4 ${isFocus === true ? 'border-[#52A8EC]' : ''}`}
          placeholderStyle={{fontSize: 18, fontFamily: 'Brighter-Regular'}}
          selectedTextStyle={{fontSize: 18, color: '#5B5B5B', fontFamily: 'Brighter-Regular'}}
          iconStyle={{width: 20, height: 20}}
          data={data}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? placeholder : ''}
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

export default DropdownList;
