import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal, Alert, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { useGlobalContext } from "../../../../context/GlobalProvider";
import { Drawer } from 'expo-router/drawer'
import { DrawerToggleButton } from '@react-navigation/drawer'
import RBSheet from 'react-native-raw-bottom-sheet';
import DropdownComponent from '../../../../partials/DropdownComponent';

const EditProfileScreen = () => {
    const { user, setUser, setIsLoggedIn } = useGlobalContext()
    const sheet = React.useRef();

  const [firstName, setFirstName] = useState('Wilson');
  const [lastName, setLastName] = useState('Jenny');
  const [email, setEmail] = useState('wilsonjenny1@gmail.com');
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    countryCode: "",
  });
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    launchImageLibrary(options, response => {
      if (response.assets) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  const handleTakePhoto = () => {
    const options = {
      saveToPhotos: true,
    };
    launchCamera(options, response => {
      if (response.assets) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  return (
    <>
    <Drawer.Screen 
    options={{
      title: "Notifications",
      headerShown: false,
      headerLeft: () => <DrawerToggleButton />
    }}/>

    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => Alert.alert('Go Back')}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit profile</Text>
      </View>

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
        <TextInput style={styles.input} placeholder="First Name" value={form.firstName} onChangeText={(e) => setForm({ ...form, firstName: e })} />
        <TextInput style={styles.input} placeholder="Last Name" value={form.lastName}  onChangeText={(e) => setForm({ ...form, lastName: e })}/>
        <TextInput style={styles.input} placeholder="Email" value={""} onChangeText={setEmail} keyboardType="email-address" />
        
        <View style={styles.phoneContainer}>
            
          <TextInput
            style={[styles.input, styles.phoneInput]}
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
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
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  editIcon: {
    position: 'absolute',
    bottom: 10,
    right: 140,
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
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
