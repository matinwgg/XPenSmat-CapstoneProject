import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';
import ScreenHeader from '../../../../components/ScreenHeader';
import CustomButton from '../../../../components/CustomButton';
import { verifyEmail, getAccount } from '../../../../lib/appwrite';
import { useGlobalContext } from '../../../../context/GlobalProvider';

const VerificationScreen = () => {
  const { user, setIsUserVerified } = useGlobalContext();
  const [isVerified, setIsVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState('');

  const timer = useRef(null);

  const refreshStatus = useCallback(
    async (showSpinner = false) => {
      if (showSpinner) setIsChecking(true);
      try {
        const account = await getAccount();
        const verified = Boolean(account?.emailVerification);
        setIsVerified(verified);
        setIsUserVerified(verified);
        return verified;
      } catch (statusError) {
        setError('We could not check your verification status.');
        return false;
      } finally {
        if (showSpinner) setIsChecking(false);
      }
    },
    [setIsUserVerified]
  );

  useFocusEffect(
    useCallback(() => {
      refreshStatus();
    }, [refreshStatus])
  );

  useEffect(() => {
    if (cooldown <= 0) return undefined;

    timer.current = setInterval(() => {
      setCooldown((seconds) => (seconds <= 1 ? 0 : seconds - 1));
    }, 1000);

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [cooldown > 0]);

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    []
  );

  const sendVerification = async () => {
    setIsSending(true);
    setError('');

    try {
      const ok = await verifyEmail();
      if (ok) {
        setSent(true);
        setCooldown(60);
      } else {
        setError('The verification email could not be sent. Try again later.');
      }
    } catch (sendError) {
      setError(
        sendError?.message || 'The verification email could not be sent.'
      );
    } finally {
      setIsSending(false);
    }
  };

  const checkAgain = async () => {
    const verified = await refreshStatus(true);
    if (!verified) {
      setError('Not verified yet. Open the link in your email, then try again.');
    }
  };

  return (
    <>
      <Drawer.Screen options={{ title: 'Verification', headerShown: false }} />

      <SafeAreaView className="flex-1 bg-[#F5F7FB]" edges={['top']}>
        <View className="flex-1 px-4">
          <ScreenHeader
            title="Email verification"
            subtitle="Secure your account"
            showBack
            onBack={() => router.back()}
          />

          <View
            className="bg-white rounded-2xl p-6 mt-2 items-center"
            style={{
              shadowColor: '#0F172A',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 12,
              elevation: 2,
            }}
          >
            <View
              className="w-20 h-20 rounded-full items-center justify-center"
              style={{ backgroundColor: isVerified ? '#DCFCE7' : '#EEF2FF' }}
            >
              <Ionicons
                name={isVerified ? 'shield-checkmark' : 'mail-unread-outline'}
                size={34}
                color={isVerified ? '#16A34A' : '#1F41BB'}
              />
            </View>

            <Text className="text-[20px] font-psemibold text-[#0F172A] mt-4 text-center">
              {isVerified ? 'Your email is verified' : 'Verify your email'}
            </Text>

            <Text className="text-[13px] font-pregular text-[#64748B] mt-2 text-center leading-5">
              {isVerified
                ? 'Thanks! Your account is fully protected.'
                : 'We will send a confirmation link to the address below. Tapping it proves the address belongs to you.'}
            </Text>

            <View className="bg-[#F8FAFC] rounded-xl px-4 py-2.5 mt-4">
              <Text className="text-[13px] font-pmedium text-[#0F172A]">
                {user?.email || 'No email on file'}
              </Text>
            </View>

            {error ? (
              <View className="flex-row items-start bg-[#FEF3C7] rounded-xl p-3 mt-4 w-full">
                <Ionicons
                  name="alert-circle-outline"
                  size={16}
                  color="#B45309"
                  style={{ marginTop: 1 }}
                />
                <Text className="flex-1 text-[12px] font-pregular text-[#92400E] ml-2 leading-5">
                  {error}
                </Text>
              </View>
            ) : null}

            {sent && !isVerified ? (
              <View className="flex-row items-start bg-[#DCFCE7] rounded-xl p-3 mt-4 w-full">
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  color="#15803D"
                  style={{ marginTop: 1 }}
                />
                <Text className="flex-1 text-[12px] font-pregular text-[#166534] ml-2 leading-5">
                  Verification email sent. Check your inbox (and spam folder).
                </Text>
              </View>
            ) : null}

            {isVerified ? (
              <View className="flex-row items-center mt-6">
                <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
                <Text className="text-[13px] font-pmedium text-[#16A34A] ml-2">
                  All set
                </Text>
              </View>
            ) : (
              <>
                <CustomButton
                  title={
                    cooldown > 0
                      ? `Resend in ${cooldown}s`
                      : 'Send verification email'
                  }
                  handlePress={sendVerification}
                  isLoading={isSending}
                  disabled={cooldown > 0 || isSending}
                  containerStyles="mt-5"
                />

                <TouchableOpacity
                  onPress={checkAgain}
                  disabled={isChecking}
                  activeOpacity={0.7}
                  className="flex-row items-center py-3 mt-1"
                  accessibilityRole="button"
                >
                  {isChecking ? (
                    <ActivityIndicator size="small" color="#1F41BB" />
                  ) : (
                    <Ionicons name="refresh" size={16} color="#1F41BB" />
                  )}
                  <Text className="text-[13px] font-pmedium text-[#1F41BB] ml-2">
                    I&apos;ve verified my email
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <Text className="text-[11px] font-pregular text-[#94A3B8] text-center mt-5 leading-5">
            Verification links expire after a while. If yours has expired, send
            a new one.
          </Text>
        </View>
      </SafeAreaView>
    </>
  );
};

export default VerificationScreen;
