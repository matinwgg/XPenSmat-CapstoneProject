import React, { useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { router } from 'expo-router';

const Profile = () => {

  useEffect(() => {
    router.navigate("(tabs)/settings/profile")

  }, [])

  return (
    <View>

    </View>
  )
}

const styles = StyleSheet.create({
container: {
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

export default Profile
