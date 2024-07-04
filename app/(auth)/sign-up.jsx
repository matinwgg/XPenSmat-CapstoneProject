import { ScrollView, StyleSheet, Button, Text, View, Modal, KeyboardAvoidingView, TouchableOpacity, Image, Alert } from 'react-native'
import React, {useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../constants'
import FormField from '../../components/FormField'
import {Link, router} from 'expo-router'
import CustomButton  from '../../components/CustomButton'

import { createUser } from '../../lib/appwrite'

const EMAIL_REGEX =  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const SignUp = () => {
  let isValid = false

  let isPwdValid = false

  const [isSubmitting, setIsSubmitting] = useState(false)  

  const [modalVisible, setModalVisible] = useState(false);

  const [form, setForm] = useState({
    email: '',
    password: '',
    username: '',
    confirmpwd: '',
})

const validate = () => {
  if (!form.username || !form.email || !form.password || !form.confirmpwd) {
    Alert.alert('Error', 'Please fill in all the fields')
  }

  if (EMAIL_REGEX.test(form.email)) {
    isValid = true
  }
  if (form.password != form.confirmpwd) {
    isPwdValid = true
  }
  if (isValid && isPwdValid) {
    setModalVisible(true)
    submit()
  }
}

const submit = async () => {
  if (!form.username || !form.email || !form.password || !form.confirmpwd) {
    Alert.alert('Error', 'Please fill in all the fields')
  }
  setIsSubmitting(true)
  try {
    const result = await createUser(form.email, form.password, form.username)
    // Set to global state

    router.replace('/sign-in')

  } catch(error) {
    Alert.alert('Error', error.message)
  }
    finally { setIsSubmitting(false)}
}

  return (
    <SafeAreaView className="flex-1 bg-white px-5">
      <ScrollView showsVerticalScrollIndicator="false">
      <View>
            <View>
            <Image 
              source={icons.hand_euro} 
              resizeMode='contain'
              className="w-[100px] h-[50px] mt-[20px] self-start -ml-5 mb-5"/>

            <Text className="self-start text-[38px] font-pextrabold mb-10">Create an account</Text>

          <FormField 
              containerStyle="w-[330px]"
              placeholder={'Username'}
              value={form.username}
              onChangeText={(e) => setForm({ ...form, username: e })}
              contentType='username'
           />

            <FormField 
              containerStyle="w-[330px] mt-5"
              placeholder={'Email address'}
              value={form.email}
              onChangeText={(e) => setForm({...form, email: e})}
              contentType='emailAddress'
              keyType='email-address'
              //emailValidation={isValid}
            />

            <FormField
              containerStyle="w-[330px] mt-5"
              placeholder={'Password'}
              value={form.password}
              onChangeText={(e) => setForm({ ...form, password: e })}
              contentType='password'
              secureTextEntry
            />

            <FormField
              containerStyle="w-[330px] mt-5"
              placeholder={'Confirm Password'}
              value={form.confirmpwd}
              onChangeText={(e) => setForm({ ...form, confirmpwd: e })}
              contentType='password'
              //passwordValidation={isPwdValid}
              secureTextEntry
            />

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Sign-Up Successful!</Text>
                <Button
                  title="Done"
                  onPress={() => {
                    setModalVisible(false);
                   // router.replace('/sign-in')
                  }}
                />
                <Button
                  title="Cancel"
                  onPress={() => setModalVisible(false)}
                />
              </View>
            </View>
          </Modal>


          <CustomButton 
              title="Register"
              handlePress={submit}
              containerStyles="mt-5"
              isLoading={isSubmitting}
              otherStyles="mt-[80px] mb-[30px] "
          />

            <View className="flex-row self-center">
                <Text className="font-pmedium ">Already have an account? </Text>
                <TouchableOpacity
                  onPress={() => router.push('/sign-in')}>
                    <Text className="font-pbold text-sky-700">Sign in</Text> 
                </TouchableOpacity>
            </View>

            </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default SignUp