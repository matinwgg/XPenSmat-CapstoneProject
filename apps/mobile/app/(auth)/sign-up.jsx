import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { createUser } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignUp = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmpwd: '',
  });

  const submit = async () => {
    if (!form.username || !form.email || !form.password || !form.confirmpwd) {
      return Alert.alert('Missing details', 'Please fill in all the fields.');
    }

    if (!emailRegex.test(form.email.trim())) {
      return Alert.alert('Invalid email', 'Please enter a valid email address.');
    }

    if (form.password.length < 8) {
      return Alert.alert(
        'Password too short',
        'Use at least 8 characters for your password.'
      );
    }

    if (form.password !== form.confirmpwd) {
      return Alert.alert('Passwords do not match', 'Please re-enter both passwords.');
    }

    setIsSubmitting(true);
    try {
      const result = await createUser(
        form.email.trim(),
        form.password,
        form.username.trim()
      );

      if (!result) {
        throw new Error('Unable to create your account. Please try again.');
      }

      setUser(result);
      setIsLoggedIn(true);
      Alert.alert('Welcome!', 'Your account was created successfully.');
      router.replace('/home');
    } catch (error) {
      Alert.alert(
        'Unable to create account',
        error?.message || 'Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        >
          <View className="flex-row items-center mb-8 mt-2">
            <View className="w-11 h-11 rounded-2xl bg-[#1F41BB] items-center justify-center">
              <Ionicons name="wallet" size={22} color="#FFFFFF" />
            </View>
            <Text className="ml-3 text-[18px] font-pbold text-[#0F172A]">
              XPenSmat
            </Text>
          </View>

          <Text className="text-[30px] font-pbold text-[#0F172A]">
            Create account
          </Text>
          <Text className="text-[14px] font-pregular text-[#64748B] mt-1 mb-7">
            Start tracking your spending in a few seconds.
          </Text>

          <FormField
            placeholder="Username"
            value={form.username}
            onChangeText={(username) => setForm({ ...form, username })}
            contentType="username"
            autoCapitalize="none"
            autoComplete="username"
          />

          <FormField
            placeholder="Email address"
            value={form.email}
            onChangeText={(email) => setForm({ ...form, email })}
            contentType="emailAddress"
            keyType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            containerStyle="mt-4"
          />

          <FormField
            placeholder="Password"
            value={form.password}
            onChangeText={(password) => setForm({ ...form, password })}
            contentType="password"
            secureTextEntry
            containerStyle="mt-4"
          />

          <Text className="text-[11px] font-pregular text-[#94A3B8] mt-1.5 ml-1">
            Use at least 8 characters.
          </Text>

          <FormField
            placeholder="Confirm password"
            value={form.confirmpwd}
            onChangeText={(confirmpwd) => setForm({ ...form, confirmpwd })}
            contentType="password"
            secureTextEntry
            containerStyle="mt-4"
          />

          <CustomButton
            title="Create account"
            handlePress={submit}
            isLoading={isSubmitting}
            containerStyles="mt-6"
          />

          <View className="flex-row self-center mt-6">
            <Text className="font-pregular text-[13px] text-[#64748B]">
              Already have an account?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => router.replace('/sign-in')}
              accessibilityRole="button"
            >
              <Text className="font-psemibold text-[13px] text-[#1F41BB]">
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
