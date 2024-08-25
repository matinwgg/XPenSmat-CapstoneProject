import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal, Alert, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useGlobalContext } from "../../../../context/GlobalProvider";
import { Drawer } from 'expo-router/drawer'
import { DrawerToggleButton } from '@react-navigation/drawer'
import RBSheet from 'react-native-raw-bottom-sheet';
import { router } from 'expo-router';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FormField from '../../../../components/FormField';
import CustomButton from '../../../../components/CustomButton';
import { CountryPicker } from "react-native-country-codes-picker";
import { alterDetails } from '../../../../lib/appwrite';

const EditProfileScreen = () => {
    const { user, setUser, setIsLoggedIn } = useGlobalContext()
    const sheet = React.useRef();
    const [show, setShow] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    phoneNumber: "",
    countryCode: "+233",
    countryFlag: "🇬🇭"
  });

  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false)  

  //console.log(form.countryFlag)

  const submit = async () => {
    if (form.email === "" || form.firstName === "" || form.lastName === "" || form.phone === "" || form.countryCode === "") {
      return Alert.alert("Error", "All entries must be filled")
    }
    try {
      if (form.email === "") {} 
        else { await alterDetails.updateEmail(form.email)}
      if (form.firstName === "") {}
        else { await alterDetails.setFName(form.email)}
      if (form.lastName === "") {}
        else { await alterDetails.setLName(form.email)}
      if (form.phoneNumber === "" || form.countryCode === "") {}
        else { 
          setForm({
            ...form,
            phone: `${form.countryCode}${form.phoneNumber}`,
        });
        await alterDetails.setPhone(form.phone) }

      //return await alterDetails.updateDetail(form.email, form.firstName, form.lastName, form.phone)
    } catch (error) {
      console.log("Appwrite service :: update user details() :: " + error.message);    
    }
    return;
  }

  return (
    <>
    <Drawer.Screen 
    options={{
      title: "Notifications",
      headerShown: false,
      headerLeft: () => <DrawerToggleButton />
    }}/>

    <SafeAreaView style={styles.container}>
      
      <View style={styles.header} className="gap-x-[90px]">
        <TouchableOpacity onPress={() => router.navigate('/settings')}>
              <FeatherIcon
                color="#000"
                name="arrow-left"
                size={24} />
          </TouchableOpacity>       
        <View className="text-center self-center justify-center items-center"><Text style={styles.headerTitle} >Edit profile</Text></View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.profileHeader}>
        <Image
          //source={profileImage ? { uri: "https://icons8.com/icon/98957/user" } : require('./default-avatar.png')}
          source={{ uri: user?.avatar, }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editIcon} onPress={() => setModalVisible(true)}>
          <Icon name="camera" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View className="mx-3" >
        <View className="flex-row gap-1 mb-5 mr-4">
          <FormField 
            containerStyle="w-[50%]"
            placeholder={'First Name'}
            value={form.firstName}
            onChangeText={(e) => setForm({ ...form, firstName: e })}
            contentType='username'
            />          
          <FormField 
            containerStyle="w-[50%]"
            placeholder={'Last Name'}
            value={form.lastName}
            onChangeText={(e) => setForm({ ...form, lastName: e })}
            contentType='username'
            />        
          </View>

          <FormField 
            containerStyle="w-[100%] mb-5"
            placeholder={'Email'}
            value={form.email}
            onChangeText={(e) => setForm({ ...form, email: e })}
            contentType='emailAddress'
            keyType='email-address'
            />       

          <View className="flex-row">
            <TouchableOpacity 
              onPress={() => setShow(true)}
              style={{
                  width: '30%',
                  height: '40%'
              }}>
            <FormField 
              containerStyle="w-[100px] mb-5"
              placeholder={''}
              value={`${form.countryFlag} ${form.countryCode}`}
              onChangeText={(e) => setForm({ ...form, countryCode: e})}
              editable={false}
              label={true}
              /> 
            </TouchableOpacity>

            <FormField 
              containerStyle="w-[70%] mb-5 mr-5 ml-1"
              placeholder={'Phone'}
              value={form.phoneNumber}
              onChangeText={(e) => setForm({ ...form, phoneNumber: e })}
              //contentType='emailAddress'
              keyType='phone-pad'
              />

          
          <CountryPicker
            show={show}
            // when picker button press you will get the country object with dial code
            pickerButtonOnPress={(item) => {
              setForm({
                ...form, 
                countryCode: item.dial_code,
                countryFlag: item.flag
              })
              setShow(false);
              }}
              style={{
                modal: {
                  height: 600,
                }
              }}
              
            />
            
        </View>

        <CustomButton 
          title="Save changes"
          handlePress={submit}
          containerStyles="mt-5"
          isLoading={isSubmitting}
          otherStyles="mt-20 mb-[30px]"
          />
      </View>

      <View>
      <RBSheet
        customStyles={{ 
            container: styles.sheetContainer, 
            draggableIcon: {
            backgroundColor: '#000',
          }, }}
          customModalProps={{
            animationType: 'slide',
            statusBarTranslucent: true,
          }}
        
        height={500}
        openDuration={250}
        ref={sheet}>
        <View style={styles.sheetContent}>

            <TouchableOpacity
            onPress={() => {
            // handle onPress
          }}>
          <View style={styles.btn}>
          </View>
        </TouchableOpacity>

        <View style={styles.spacer} />

        <TouchableOpacity
          onPress={() => {}}>
          <View style={styles.btnSecondary}>
          </View>
        </TouchableOpacity>
      </View>
    </RBSheet>
      </View>

      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload Photo</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleChoosePhoto}>
              <Icon name="photo" size={20} color="#000" />
              <Text style={styles.modalButtonText}>Upload from gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleTakePhoto}>
              <Icon name="camera" size={20} color="#000" />
              <Text style={styles.modalButtonText}>Take a photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}
      </ScrollView>
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 7
  },
  header: {
    flexDirection: 'row',
    padding: 16,
  },
  headerTitle: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    //backgroundColor: '#f5f5f5',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 70,
    marginBottom: 30,
  },
  editIcon: {
    position: 'absolute',
    bottom: 45,
    right: 120,
    backgroundColor: '#000',
    borderRadius: 15,
    padding: 5,
  },
  
  input: {
    height: 20,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    paddingVertical: 24
  },
  picker: {
    height: 40,
    flex: 1,
  },
  phoneInput: {
    flex: 3,
    marginLeft: 8,
    width: 24
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    width: '100%',
  },
  modalButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 10,
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: 'red',
  },
  sheetContainer: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  sheetContent: {
    paddingTop: 24,
    paddingHorizontal: 5,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181818',
    marginTop: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    fontWeight: '400',
    color: '#555',
    marginTop: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  spacer: {
    marginBottom: 12,
  },
  /** Placeholder */
  placeholder: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    height: 400,
    marginTop: 0,
    padding: 24,
    backgroundColor: 'transparent',
  },
  placeholderInset: {
    borderWidth: 4,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 9,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#2b64e3',
    borderColor: '#2b64e3',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  btnSecondaryText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#2b64e3',
  },
});

export default EditProfileScreen;
