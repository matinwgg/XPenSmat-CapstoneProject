import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Button, TextInput, Alert } from 'react-native';

const VerifyEmail = () => {
    const [userId, setUserId] = useState('');
    const [secret, setSecret] = useState('');
    const [enteredSecret, setEnteredSecret] = useState('');
  
    useEffect(() => {
      // Parse query parameters from URL
      const queryParams = new URLSearchParams(window.location.search);
      const userIdParam = queryParams.get('userId');
      const secretParam = queryParams.get('secret');
  
      if (userIdParam && secretParam) {
        setUserId(userIdParam);
        setSecret(secretParam);
      } else {
        Alert.alert('Invalid URL', 'Missing userId or secret.');
      }
    }, [location.search]);
  
    const handleVerify = () => {
      if (enteredSecret === secret) {
        Alert.alert('Success', 'Verification successful!');
        // Navigate to another screen or perform some action
        //navigate('/home'); // or use your navigation method
      } else {
        Alert.alert('Error', 'Incorrect secret.');
      }
    };
  
    return (
      <View style={{ padding: 20 }}>
        <Text>Verify Your Account</Text>
        <TextInput
          placeholder="Enter the secret"
          value={enteredSecret}
          onChangeText={setEnteredSecret}
          secureTextEntry
          style={{ borderWidth: 1, borderColor: 'gray', marginBottom: 10, padding: 8 }}
        />
        <Button title="Verify" onPress={handleVerify} />
      </View>
    );
}

export default VerifyEmail

const styles = StyleSheet.create({})