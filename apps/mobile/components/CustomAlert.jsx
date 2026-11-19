import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import FeatherIcon from '@expo/vector-icons/Feather';

/**
 * Simple confirmation alert.
 *
 * `visible` and `onClose` make the component controlled by its parent. When no
 * `onClose` handler is supplied the alert still renders (it simply cannot be
 * dismissed), which keeps it usable in storybook-style previews.
 */
const CustomAlert = ({ msg, msg2, visible = false, onClose }) => {
  const [modalVisible, setModalVisible] = useState(Boolean(visible));

  useEffect(() => {
    setModalVisible(Boolean(visible));
  }, [visible]);

  const close = () => {
    setModalVisible(false);
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      animationType="fade"
      onRequestClose={close}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <FeatherIcon
            color="#2b64e3"
            name="check-circle"
            size={40}
            style={styles.icon}
          />
          <Text style={styles.message}>{msg}</Text>
          {msg2 ? <Text style={styles.message}>{msg2}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={close}>
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
