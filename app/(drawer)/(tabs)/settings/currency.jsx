import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Card } from '../../../../components/Transaction'
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../../../../context/GlobalProvider';
import InputField from '../../../../components/InputField';
import CurrencyPicker from '../../../../partials/CurrencyPicker';

const Location = () => {
    const { globalCurrency } = useGlobalContext();

    const navigation = useNavigation(); // Get the navigation object
    
    const [currName, setCurrName] = useState("ghana cedis")

    const sendDataBack = () => {     
        navigation.goBack() 
    };       

    //console.log(globalCurrency.name)

  return (
    <View style={{ flex: 1, alignSelf: 'center'}}>
          <Card style={{ 
            alignItems: 'center', 
            alignSelf: 'center', 
            marginTop: 30, 
            height: 370, 
            marginHorizontal: -80}}>
            <View className="mx-2 mb-5  w-full">

            <Text className="font-psemibold text-xl -mb-2 text-[#1F41BB]">Your currency:</Text>
            <InputField 
              value={globalCurrency.name}
              containerStyle="w-[300px] rounded-xl"
              placeholder={""}
              onChangeText={(e) => {
                setCurrName(globalCurrency.currency)
            }}
              currency={true}
              inputStyle=' w-40'
              editable={false}
            />
            <View className="mb-20 w-[300px]">
                <CurrencyPicker />
            </View>
            <TouchableOpacity
              onPress={sendDataBack}
              style={{ 
                backgroundColor: '#007AFF', 
                padding: 10, 
                borderRadius: 10, 
                width: 'auto', 
                marginTop: 100 }}
              >
              <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center',  }}>Confirm</Text>
            </TouchableOpacity>
            </View>
            </Card>
          </View>
  )
}

export default Location
