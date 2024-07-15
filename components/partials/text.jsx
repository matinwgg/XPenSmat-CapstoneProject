import React, { useState } from 'react';
import { BottomSheet, Button, ListItem } from '@rneui/themed';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';



const BottomSheetComponent = () => {
const [isVisible, setIsVisible] = useState(false);
const list = [
  { title: 'List Item 1' },
  { title: 'List Item 2' },
  {
    title: 'Cancel',
    containerStyle: { backgroundColor: 'red' },
    titleStyle: { color: 'white' },
    onPress: () => setIsVisible(false),
  },
];

return (
  <SafeAreaProvider>
    <Button
      title="Open Bottom Sheet"
      onPress={() => setIsVisible(true)}
      buttonStyle={styles.button}
    />
    <BottomSheet modalProps={{}} isVisible={isVisible}>
      {list.map((l, i) => (
        <ListItem
          key={i}
          containerStyle={l.containerStyle}
          onPress={l.onPress}
        >
          <ListItem.Content>
            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </BottomSheet>
  </SafeAreaProvider>
);
};

const styles = StyleSheet.create({
button: {
  margin: 10,
},
});

export default BottomSheetComponent;






const BottomSheetComponent = () => {
    const [isVisible, setIsVisible] = useState(false);
  
  
    return (
      <>
        <Drawer.Screen 
        options={{
          headerShown: false,
          gestureEnabled: false,      
        }}/>
        <SafeAreaProvider>
              <View className="self-center mt-[90%]">
                <Button
                  title="Open Bottom Sheet"
                  className="justify-center"
                  onPress={() => setIsVisible(true)}
                />
              </View>
                  
                  
                <BottomSheet modalProps={{}} isVisible={isVisible}>
                    <View className="flex-row">
                      <TextInput 
                        placeholder='Expense Name'
                        placeholderTextColor="#7B7B8B"
                        onChangeText={() => {}}
                        className="border-collapse border-b-2 border-b-gray-500"
                      />
                      <TouchableOpacity onPress={() => setIsVisible(false)}>
                        <Image source={icons.close} resize="contain" className="w-6 h-6 self-end mr-2 -mt-2"/>
                        </TouchableOpacity>
                    </View>
                    <TextInput 
                        placeholder='GHS Amount'
                        placeholderTextColor="#7B7B8B"
                        onChangeText={() => {}}
                        className="border-collapse border-b-2 border-b-gray-500"
                        keyboardType='decimal-pad'
                      />
                    <View className="flex-row">
                          <TextInput 
                            placeholder='Date'
                            placeholderTextColor="#7B7B8B"
                            onChangeText={() => {}}
                            className="border-collapse border-b-2 border-b-gray-500 w-[60%]"
                          />
                          <Button 
                            title="set date"
                            color="green"
                            onPress={() => {}}
                            className=""
                          />
                      </View>
  
                      <View>
                        <Text className="text-[#7B7B8B]">Select Category</Text>
                        <Button 
                        title="Add Expense"
                        color="green"
                        onPress={() => {}}
                        className="text-lg text-black"
                        />
                      </View>
                      
  
                  </BottomSheet>
                  </SafeAreaProvider>
  
    </>
    );
  }
  
  export default BottomSheetComponent;
  