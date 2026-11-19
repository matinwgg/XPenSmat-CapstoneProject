import React, { useState } from 'react';
import {
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
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import { recoverPwd } from '../../lib/appwrite';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPwd = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [error, setError] = useState('');

  const submit = async () => {
    const trimmed = email.trim();

    if (!trimmed) {
      setError('Enter the email address for your account.');
      return;
    }

    if (!emailRegex.test(trimmed)) {
      setError('That email address does not look right.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const sent = await recoverPwd.recovery(trimmed);
      if (sent) {
        setSentTo(trimmed);
      } else {
        setError('We could not send the recovery email. Please try again.');
      }
    } catch (sendError) {
      setError(
        sendError?.message || 'We could not send the recovery email.'
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
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-11 h-11 rounded-xl bg-[#EEF2FF] items-center justify-center mt-2 mb-8"
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color="#1F41BB" />
          </TouchableOpacity>

          {sentTo ? (
            <View>
              <View className="w-16 h-16 rounded-full bg-[#DCFCE7] items-center justify-center">
                <Ionicons
                  name="mail-unread-outline"
                  size={28}
                  color="#16A34A"
                />
              </View>

              <Text className="text-[28px] font-pbold text-[#0F172A] mt-5">
                Check your inbox
              </Text>
              <Text className="text-[14px] font-pregular text-[#64748B] mt-2 leading-6">
                If an account exists for{' '}
                <Text className="font-psemibold text-[#0F172A]">{sentTo}</Text>,
                you will receive a link to reset your password shortly.
              </Text>

              <View className="flex-row items-start bg-[#F8FAFC] rounded-xl p-3 mt-5">
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color="#64748B"
                  style={{ marginTop: 1 }}
                />
                <Text className="flex-1 text-[12px] font-pregular text-[#475569] ml-2 leading-5">
                  The link expires after a short time. If it does, come back and
                  request another one.
                </Text>
              </View>

              <CustomButton
                title="Back to sign in"
                handlePress={() => router.replace('/sign-in')}
                containerStyles="mt-7"
              />

              <TouchableOpacity
                onPress={() => setSentTo('')}
                activeOpacity={0.7}
                className="self-center py-3 mt-2"
                accessibilityRole="button"
              >
                <Text className="text-[13px] font-pmedium text-[#1F41BB]">
                  Use a different email
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text className="text-[30px] font-pbold text-[#0F172A]">
                Forgot password?
              </Text>
              <Text className="text-[14px] font-pregular text-[#64748B] mt-1 mb-7 leading-6">
                It happens. Enter the email address associated with your account
                and we will send you a reset link.
              </Text>

              <FormField
                value={email}
                placeholder="Email address"
                onChangeText={(value) => {
                  setEmail(value);
                  if (error) setError('');
                }}
                contentType="emailAddress"
                keyType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              {error ? (
                <Text className="text-[12px] font-pregular text-[#DC2626] mt-2 ml-1">
                  {error}
                </Text>
              ) : null}

              <CustomButton
                title="Send reset link"
                handlePress={submit}
                isLoading={isSubmitting}
                containerStyles="mt-6"
              />

              <View className="flex-row self-center mt-6">
                <Text className="font-pregular text-[13px] text-[#64748B]">
                  Remembered it?{' '}
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
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPwd;
