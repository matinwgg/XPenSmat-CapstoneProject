import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Swiper from 'react-native-swiper';
import RBSheet from 'react-native-raw-bottom-sheet';
import FeatherIcon from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppwriteException } from 'appwrite';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { icons } from '../../constants';
import { onboarding } from '../../constants/onboarding';
import { useGlobalContext } from '../../context/GlobalProvider';
import {
  getCurrentUser,
  signIn,
  SignInWithGoogle,
  SignInWithGitHub,
} from '../../lib/appwrite';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);

  const swiperRef = useRef(null);
  const sheetRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === onboarding.length - 1;

  const [form, setForm] = useState({ email: '', password: '' });

  const closeOnboarding = () => {
    sheetRef.current?.close();
  };

  useEffect(() => {
    sheetRef.current?.open();
  }, []);

  const submit = async () => {
    if (!form.email || !form.password) {
      return Alert.alert('Missing details', 'Please fill in all the fields.');
    }
    if (!emailRegex.test(form.email.trim())) {
      return Alert.alert('Invalid email', 'Please enter a valid email address.');
    }
    if (form.password.length < 8) {
      return Alert.alert('Password too short', 'Use at least 8 characters.');
    }

    setIsSubmitting(true);
    try {
      await signIn(form.email.trim(), form.password);
      const result = await getCurrentUser();

      if (!result) {
        return Alert.alert(
          'Sign in failed',
          'We could not load your account. Please try again.'
        );
      }

      setUser(result);
      setIsLoggedIn(true);
      router.replace('/home');
    } catch (error) {
      if (error instanceof AppwriteException) {
        if (error.type === 'user_not_found') {
          Alert.alert('Account not found', 'Check your email and try again.');
          return;
        }
        if (error.code === 401 || error.type === 'user_invalid_credentials') {
          Alert.alert('Incorrect credentials', 'Check your email and password.');
          return;
        }
      }
      Alert.alert(
        'Sign in failed',
        error?.message || 'Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocial = async (provider) => {
    if (socialLoading) return;
    setSocialLoading(provider);

    try {
      if (provider === 'google') await SignInWithGoogle();
      else await SignInWithGitHub();
    } catch (error) {
      Alert.alert(
        `${provider === 'google' ? 'Google' : 'GitHub'} sign in failed`,
        error?.message || 'Please try again.'
      );
    } finally {
      setSocialLoading(null);
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
          contentContainerStyle={styles.content}
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
            Welcome back
          </Text>
          <Text className="text-[14px] font-pregular text-[#64748B] mt-1 mb-7">
            Sign in to keep track of your money.
          </Text>

          <FormField
            placeholder="Email address"
            value={form.email}
            onChangeText={(email) => setForm({ ...form, email })}
            contentType="emailAddress"
            keyType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <FormField
            placeholder="Password"
            value={form.password}
            onChangeText={(password) => setForm({ ...form, password })}
            contentType="password"
            secureTextEntry
            containerStyle="mt-4"
          />

          <TouchableOpacity
            onPress={() => router.push('/forgot-pwd')}
            className="self-end mt-3 mb-2 py-1"
            accessibilityRole="button"
          >
            <Text className="font-psemibold text-[13px] text-[#1F41BB]">
              Forgot password?
            </Text>
          </TouchableOpacity>

          <CustomButton
            title="Sign in"
            handlePress={submit}
            isLoading={isSubmitting}
            containerStyles="mt-3"
          />

          <View className="flex-row items-center my-6">
            <View style={styles.divider} />
            <Text className="mx-3 text-[12px] font-pregular text-[#94A3B8]">
              or continue with
            </Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity
            onPress={() => handleSocial('google')}
            disabled={Boolean(socialLoading)}
            activeOpacity={0.85}
            className="border border-[#E2E8F0] rounded-[14px] h-[52px] mb-3 flex-row items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
          >
            {socialLoading === 'google' ? (
              <ActivityIndicator size="small" color="#1F41BB" />
            ) : (
              <>
                <Image
                  source={icons.google}
                  resizeMode="contain"
                  className="w-5 h-5 mr-2.5"
                />
                <Text className="text-[#0F172A] font-pmedium text-[14px]">
                  Continue with Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSocial('github')}
            disabled={Boolean(socialLoading)}
            activeOpacity={0.85}
            className="border border-[#E2E8F0] rounded-[14px] h-[52px] flex-row items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="Continue with GitHub"
          >
            {socialLoading === 'github' ? (
              <ActivityIndicator size="small" color="#1F41BB" />
            ) : (
              <>
                <Image
                  source={icons.github}
                  resizeMode="contain"
                  className="w-5 h-5 mr-2.5"
                />
                <Text className="text-[#0F172A] font-pmedium text-[14px]">
                  Continue with GitHub
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View className="flex-row self-center mt-8">
            <Text className="font-pregular text-[13px] text-[#64748B]">
              Don&apos;t have an account?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/sign-up')}
              accessibilityRole="button"
            >
              <Text className="font-psemibold text-[13px] text-[#1F41BB]">
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <RBSheet
        ref={sheetRef}
        height={440}
        openDuration={180}
        closeDuration={120}
        customStyles={{
          container: {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          },
        }}
      >
        <View className="flex-row items-center justify-between px-5 pt-4">
          <Text className="text-[12px] font-psemibold text-[#94A3B8] uppercase">
            Quick tour
          </Text>
          <TouchableOpacity
            onPress={closeOnboarding}
            className="w-9 h-9 items-center justify-center rounded-full bg-[#F1F5F9]"
            accessibilityRole="button"
            accessibilityLabel="Close onboarding"
          >
            <FeatherIcon color="#64748B" name="x" size={18} />
          </TouchableOpacity>
        </View>

        <Swiper
          ref={swiperRef}
          loop={false}
          showsButtons={false}
          dot={<View style={styles.dot} />}
          activeDot={<View style={[styles.dot, styles.activeDot]} />}
          onIndexChanged={setActiveIndex}
        >
          {onboarding.map((item) => (
            <View
              key={item.id}
              className="flex-1 items-center justify-center px-8 pt-4"
            >
              <View className="w-24 h-24 rounded-full bg-[#EEF2FF] items-center justify-center">
                <Image
                  source={item.image}
                  className="h-14 w-14"
                  resizeMode="contain"
                />
              </View>
              <Text className="text-[19px] font-pbold text-[#0F172A] mt-5 text-center">
                {item.title}
              </Text>
              <Text className="text-[13px] font-pregular text-[#64748B] text-center mt-2 leading-5">
                {item.description}
              </Text>
            </View>
          ))}
        </Swiper>

        <View className="px-8 pb-6">
          <CustomButton
            title={isLastSlide ? 'Get started' : 'Next'}
            handlePress={() =>
              isLastSlide
                ? closeOnboarding()
                : swiperRef.current?.scrollBy(1)
            }
          />
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
  },
  divider: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E2E8F0',
  },
  dot: {
    width: 28,
    height: 4,
    marginHorizontal: 4,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
  },
  activeDot: {
    backgroundColor: '#1F41BB',
  },
});

export default SignIn;
