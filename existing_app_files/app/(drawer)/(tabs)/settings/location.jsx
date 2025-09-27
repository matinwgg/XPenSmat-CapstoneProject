import { StyleSheet, Text, View, TouchableOpacity,ActivityIndicator, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { Card } from '../../../../components/Transaction'
import { TextField } from '../../../../components'
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../../../../context/GlobalProvider';
import InputField from '../../../../components/InputField';
import { alterDetails, getDocumentId } from '../../../../lib/appwrite';

const Location = () => {
    const { setCity, setCountry, setUser } = useGlobalContext();
    const [isLoading, setIsLoading] = useState(false)
    const navigation = useNavigation(); // Get the navigation object

    const [ field, setField ] = useState({
        city: "",
        country: ""
      })

      const submit = async () => {
        try {
          setIsLoading(true)
          const documentId = await getDocumentId();

          setCity(field.city)
          setCountry(field.country)

          setUser(prevUser => ({
            ...prevUser,
            city: field.city,
            country: field.country
          }));
  
          await alterDetails.setCity(documentId, field.city)
          await alterDetails.setCountry(documentId, field.country)
  
          Alert.alert("Success", "You've successfully updated your location details")
          navigation.goBack()

        } catch (error) {
          setIsLoading(false)
        }
     
    };       

  return (
    <ScrollView >
    <View style={{ flex: 1, alignSelf: 'center'}}>
          <Card style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 30, height: 240, marginHorizontal: -80}}>
            <View className="mx-2 mb-10 w-full">
            <InputField 
              containerStyle="w-[300px] rounded-xl mt-7"
              placeholder={"Enter City"}
              onChangeText={(e) => setField({...field, city: e})}
              inputStyle=' w-40'
              label={"Enter city"}
              editValue={true}
            />
            <InputField 
              containerStyle="w-[300px] rounded-xl"
              placeholder={"Enter Country"}
              onChangeText={(e) => setField({...field, country: e})}
              label={"Enter country"}
              editValue={true}

            />

            <TouchableOpacity
              onPress={submit}
              style={{ backgroundColor: '#007AFF', padding: 10, borderRadius: 10, width: 'auto', marginBottom: -8, marginTop: 30 }}
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
          </ScrollView>
  )
}

export default Location