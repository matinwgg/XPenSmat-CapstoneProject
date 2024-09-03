import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity,
  Image, Modal,
  Alert, 
  SafeAreaView, 
  ScrollView, 
   } from 'react-native';
import { useGlobalContext } from "../../../../context/GlobalProvider";
import { Drawer } from 'expo-router/drawer'
import { DrawerToggleButton } from '@react-navigation/drawer'
import RBSheet from 'react-native-raw-bottom-sheet';
import { router } from 'expo-router';
import FeatherIcon from 'react-native-vector-icons/Feather';
import CustomButton from '../../../../components/CustomButton';
import { CountryPicker } from "react-native-country-codes-picker";
import { alterDetails, getDocumentId } from '../../../../lib/appwrite';
import InputField from '../../../../components/InputField';
import { icons } from "../../../../constants";


const EditProfileScreen = () => {
    const { user } = useGlobalContext()
    const sheet = React.useRef();
    const [show, setShow] = useState(false);

   const [editable, setEditable] = useState(false)
  const [editPress, setEditPress] = useState(false)

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    phoneNumber: "",
    countryCode: "+233",
    countryFlag: "🇬🇭"
  });

  const [isSubmitting, setIsSubmitting] = useState(false)
  //console.log(form.countryFlag)

  const submit = async () => {
    const documentId = await getDocumentId();
    if (form.phoneNumber.length !== 9) {
      //console.log(form.phoneNumber.length)
      if (form.phoneNumber.length === 10 && form.phoneNumber.startsWith('0')) {
        setForm({
          ...form,
          phoneNumber: form.phoneNumber.substring(1),
      });
        //console.log(form.phoneNumber)
    } else {
      setForm({
        ...form,
        phoneNumber: form.phoneNumber,
    })
      //return Alert.alert("Invalid Phone number", "Phone number input should be exactly 10 digit long")
    }
    }

    setIsSubmitting(true)

    try {
      if (form.firstName === "") {}
        else { 
          await alterDetails.setFName(documentId, form.firstName)
        }
      if (form.lastName === "") {}
        else { 
          await alterDetails.setLName(documentId, form.lastName)
        }
      if (form.phoneNumber === "" || form.countryCode === "") {}
        else { 
          setForm({
            ...form,
            phone: `${form.countryCode}${form.phoneNumber}`,
        });

        //console.log(form.phoneNumber) 

       console.log(form.phone)

        await alterDetails.setPhone(documentId, form.phone)
      }
        setEditPress(false)
        Alert.alert("Success", "You've successfully altered your details")
    } catch (error) {
      console.log("Appwrite service :: update user details() :: " + error.message);    
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    //console.log(form.phone)
  }, [])

  return (
    <>
    <Drawer.Screen 
    options={{
      title: "Notifications",
      headerShown: false,
      headerLeft: () => <DrawerToggleButton />
    }}/>

    <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
      <View style={styles.header} className="gap-x-[90px]">
        <TouchableOpacity onPress={() => router.navigate('/settings')}>
              <FeatherIcon
                color="#000"
                name="arrow-left"
                size={24} />
          </TouchableOpacity>       
        <View className="flex-row text-center self-center justify-center items-center">
          <Text style={styles.headerTitle} className="right-3 font-mbold">Edit Profile</Text>
          <TouchableOpacity 
            onPress={() => { 
              //setEditable(true); 
              setEditPress(!editPress)
              }} 
              activeOpacity={0.7}
              style={{ 
                left: 85,
              }}
            >
              <FeatherIcon 
                color="#1F41BB" 
                name={editPress ? "edit" : "square"} 
                size={22} 
                style={{ borderRadius: 40, }} 
              />
          </TouchableOpacity>  
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="rounded-xl">
      <View style={styles.profileHeader}>
        <Image
          //source={profileImage ? { uri: "https://icons8.com/icon/98957/user" } : require('./default-avatar.png')}
          source={{ uri: user?.avatar, }}
          style={styles.avatar}
        />
      </View>

      {/* <Text className="pl-2 font-pbold text-3xl bg-white text-[#331]">Personal Information</Text> */}

        <View className=" bg-white rounded-lg shadow-sm shadow-neutral-300 px-5 py-3">
        <View >
          {/* First name */}
            <View className="flex mb-2">
              <InputField
                label={"First name"}
                isFocus={true}
                placeholder={user?.firstName}
                containerStyle="w-full mt-2.5"
                inputStyle="p-3.5"
                value={form.firstName}
                onChangeText={(e) => setForm({ ...form, firstName: e })}
                editable={editPress}
                editValue={editPress}
              />
                <FeatherIcon
                  color={editPress ? "#000" : "#9da0a7"}
                  name="edit-3"
                  style={{position:'absolute', right: 12, bottom: 17}}
                  size={20} 
                  />
            </View>
            {/* Last name */}
            <View className="flex mb-1">
              <InputField
                label={"Last name"}
                isFocus
                placeholder={user?.lastName}
                onChangeText={(e) => setForm({ ...form, lastName: e })}
                containerStyle="w-full"
                value={form.lastName}
                inputStyle="p-3.5"
                editable={editPress}
                editValue={editPress}

              />
                <FeatherIcon
                  color={editPress ? "#000" : "#9da0a7"}
                  name="edit-3"
                  style={{position:'absolute', right: 12, bottom: 17}}
                  size={20} 
                  />
            </View>
          </View>

           {/* Username */}
           <View className="flex">
              <InputField
                icon={icons.profile}
                value={user?.username}
                containerStyle="w-full"
                inputStyle="text-[#9da0a7]"
                editable={editable}
              />
            </View>

          {/* Email */}
          <View className=''>
            <InputField
              icon={icons.email}
              textContentType="emailAddress"
              value={user?.email}
              editable={false}
              inputStyle="text-[#9da0a7]"
            />
          </View>
      
          {/* Phone Code  */}
          <View className="flex-row mt-2 mb-20">
          <View style={{ position: 'relative' }}>
            <InputField
              containerStyle="w-[110px] h-[48px] -mt-2 "
              inputStyle="p-3.5 "
              value={`${form.countryFlag} ${form.countryCode}`}
              onChangeText={(e) => setForm({ ...form, countryCode: e})}
              editable={false} 
              editValue={editPress}
            />

            <TouchableOpacity 
              onPress={() => setShow(true)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'transparent',
                zIndex: 1, // Ensure it's above the InputField
              }}
            />
          </View>

            {/* Phone Number Input */}
            <InputField
              label={"Phone"}
              isFocus={true}
              placeholder={user?.phone.substring(4)}
              containerStyle="w-[200px] ml-3 -mt-2"
              inputStyle="p-3.5"
              value={form.phoneNumber}
              onChangeText={(e) => setForm({ ...form, phoneNumber: e })}
              editable={editPress}
              keyType='number-pad'
              editValue={editPress}
            />
            <FeatherIcon
              color={editPress ? "#000" : "#9da0a7"}
              name="edit-3"
              style={{position:'absolute', right: 12, bottom: 17}}
              size={20} 
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
                  width: '80%'
                },
              }}
              
            />
            
        </View>

        <CustomButton 
          title="Save"
          handlePress={submit}
          containerStyles="mt-5"
          isLoading={isSubmitting}
          otherStyles="mt-5 -top-[50px]"
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
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 7
  },
  header: {
    flexDirection: 'row',
    padding: 16,
  },
  headerTitle: {
    marginLeft: 16,
    fontSize: 23,
    //fontWeight: 'bold',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 70,
  
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
