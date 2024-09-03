import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Card } from '../../../../components/Transaction'
import { TextField } from '../../../../components'
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../../../../context/GlobalProvider';
import InputField from '../../../../components/InputField';


const Location = () => {
    const { setLocation } = useGlobalContext();

    const navigation = useNavigation(); // Get the navigation object

    const [ field, setField ] = useState({
        city: "",
        country: ""
      })

      const sendDataBack = () => {
        setLocation({
            city: field.city,
            country: field.country
        });      
        navigation.goBack() 
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
            />
            <InputField 
              containerStyle="w-[300px] rounded-xl"
              placeholder={"Enter Country"}
              onChangeText={(e) => setField({...field, country: e})}
              inputStyle=''
            />

            <TouchableOpacity
              onPress={sendDataBack}
              style={{ backgroundColor: '#007AFF', padding: 10, borderRadius: 10, width: 'auto', marginBottom: -8, marginTop: 30 }}
              >
              <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center',  }}>Confirm</Text>
            </TouchableOpacity>
            </View>
            </Card>
          </View>
          </ScrollView>
  )
}

export default Location