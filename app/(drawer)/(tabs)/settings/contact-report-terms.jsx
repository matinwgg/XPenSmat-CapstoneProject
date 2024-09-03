import { ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import { ReportBugContent, ContactContent, TermsPrivacyContent } from '../../../../components/CustomText';
import { useLocalSearchParams } from "expo-router";
import { Drawer } from 'expo-router/drawer';

const About = () => {
  const { type } = useLocalSearchParams(); 
  
  let ContentComponent = null;
  let headerTitle = "Settings"; 

  if (type === 'contact') {
    ContentComponent = ContactContent;
    headerTitle = "Contact Us";
  } else if (type === 'report') {
    ContentComponent = ReportBugContent;
    headerTitle = "Report a Bug";
  } else if (type === 'terms') {
    ContentComponent = TermsPrivacyContent;
    headerTitle = "Terms and Privacy";
  }

  return (
    <>
      <Drawer.Screen 
        options={{
          title: headerTitle,
          headerShown: true,
        }}
      />
      <ScrollView style={styles.container}>
        {ContentComponent && <ContentComponent />}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
});

export default About;
