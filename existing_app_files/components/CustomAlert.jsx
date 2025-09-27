import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

const CustomAlert = ({msg, msg2}) => {
    const [modalVisible, setModalVisible] = useState(false);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={() => {
        setModalVisible(!modalVisible)
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <FeatherIcon
            color="#2b64e3"
            name="check-circle"
            size={40}
            style={styles.icon}
          />
          <Text style={styles.message} className="font-pbold">{msg}</Text>
          <Text style={styles.message}>{msg2}</Text>
          <TouchableOpacity style={styles.button} onPress={setModalVisible(!modalVisible)}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2b64e3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CustomAlert;
