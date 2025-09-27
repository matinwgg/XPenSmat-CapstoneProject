import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Card } from '../../../../components/Transaction'
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../../../../context/GlobalProvider';
import InputField from '../../../../components/InputField';
import CurrencyPicker from '../../../../partials/CurrencyPicker';
import { alterDetails, getDocumentId } from '../../../../lib/appwrite';
import { TextField } from '../../../../components';

const Location = () => {
    const { user, globalCurrency, setCurrency } = useGlobalContext();
    const navigation = useNavigation(); // Get the navigation object
    
    const [currName, setCurrName] = useState("currency")
    const [isLoading, setIsLoading] = useState(false)

    const submit = async () => {  
      try {
        setIsLoading(true);
        const documentId = await getDocumentId()
    
        setCurrency({ 
          ...globalCurrency, 
          name: globalCurrency.name
        });
        
        await alterDetails.setCurrency(documentId, globalCurrency.name);



        navigation.goBack(); 
      } catch (error) {
        console.log("Currency", error);
      } finally {
        setIsLoading(false);
      }
    };
         

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
            
            <TextField 
              value={globalCurrency.name}
              containerStyle="w-[300px] rounded-xl bg-gray-100 mt-2"
              placeholder={""}
              handleTextChange={(e) => {
                setCurrName(globalCurrency.name)
            }}
              locationStyles={{ backgroundColor: "#E5E4E2"}}
              currency={true}
              inputStyle=' w-40'
              editable={false}
            />

            <View className="mb-20 w-[300px]">
                <CurrencyPicker />
            </View>

            <TouchableOpacity
              onPress={submit}
              style={{ 
                backgroundColor: '#007AFF', 
                padding: 10, 
                borderRadius: 10, 
                width: 'auto', 
                marginTop: 100 }}
              >
                {isLoading == true ? (
                      <ActivityIndicator size="small" color='#FFF' />
                  ) : (
                      <Text className={`text-center text-white font-mbold text-lg`}>
                          Confirm
                      </Text>
                  )}   
            </TouchableOpacity>
            </View>
            </Card>
          </View>
  )
}

export default Location
