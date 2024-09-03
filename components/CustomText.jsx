// customModalContent.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Transaction';

export const ReportBugContent = () => {
  return (
    <Card style={styles.card} className="-px-5">
    <View style={styles.container} >
      <Text style={styles.paragraph}>
        We appreciate your help in improving our expense tracking app.
         If you encounter any issues or bugs, please follow these steps to report them:
      </Text>
      <Text style={styles.paragraph}>
        1. Provide a Brief Description: Describe the issue you’re facing in as much detail as possible. Include any error messages you see and the steps you took before the bug occurred.
      </Text>
      <Text style={styles.paragraph}>
        2. Include Reproduction Steps: If possible, provide a clear set of steps to reproduce the issue. This helps us understand the problem and work on a fix more efficiently.
      </Text>
      <Text style={styles.paragraph}>
        3. Attach Screenshots or Videos: 
        Screenshots or videos can be incredibly helpful in diagnosing the problem. 
        Attach any relevant images or screen recordings that show the issue.📷
      </Text>
      <Text style={styles.paragraph}>
        4. Include Your Device and App Information: {"\n"}Device Model: 
        [e.g., iPhone 14, Samsung Galaxy S23] {"\n"}Operating System: 
        [e.g., iOS 17.0, Android 13] {"\n"}App Version: [e.g., 1.2.3]🖥
      </Text>
      <Text style={styles.paragraph}>
        5. Submit Your Report: 
        Send the details to our support team using the following methods: 
        Email: [bugs@techwgg.com]{"\n"} 
        Support Form: [www.techwgg.com/support/bug-report]🔗
      </Text>
      <Text style={styles.paragraph} className="font-mregular mt-1">
        6. Follow Up: Our support team will review your report and 
        get back to you if we need more information.{"\n"} 
        Thank you for helping us make our app better!🎉
      </Text>
    </View>
    </Card>
  );
};


export const ContactContent = () => {
  return (
    <Card style={styles.card} className="mt-[40px]">
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        Company Name:{"\n"}TechWgg Innovators Inc.
      </Text>
      <Text style={styles.paragraph}>
        Address:{"\n"}1234 Innovation Drive, Tema Comm 5, Greater Accra, Ghana
      </Text>
      <Text style={styles.paragraph}>
        Email:{"\n"}support@techwgg.com📩
      </Text>
      <Text style={styles.paragraph}>
        Phone:{"\n"}+233-54-675-4286 📞
      </Text>
      <Text style={styles.paragraph}>
        Website:{"\n"}www.techwgginc.com
      </Text>
      <Text style={styles.paragraph}>
        Support Hours:{"\n"}Monday - Friday: 9:00 AM - 5:00 PM (GMT){"\n"} 
        Saturday - Sunday: Closed⌛
      </Text>
      <Text style={styles.paragraph}>
        Social Media:{"\n"}Facebook, Twitter, LinkedIn
      </Text>
      <Text style={styles.paragraph} className="font-mregular">
        For any inquiries or support related to our expense tracking app, 
        please feel free to reach out to us through any of the above contact methods. 
        We are here to help!
      </Text>
    </View>
    </Card>
  );
};

export const TermsPrivacyContent = () => {
  return (
    <Card style={styles.card} className="mt-[100px] h-80">
          <View style={styles.container}>
      <Text style={styles.paragraph}>Effective Date: November 1, 2024</Text>
      <Text style={styles.paragraph}>
        1. Acceptance of Terms: {"\n"}By using Aora, you agree to these Terms of Service. If you do not agree, please do not use our app.
      </Text>
      <Text style={styles.paragraph}>
        2. Changes to Terms: {"\n"}We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on our website. Your continued use of the app constitutes acceptance of the updated Terms.
      </Text>
      {/* Continue with the rest of the terms and privacy policy */}
        </View>
        </Card>

  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  paragraph: {
    fontSize: 16,
    fontFamily: 'Brighter-Regular',
    color: '#333',
    marginBottom: 10,
  },
});