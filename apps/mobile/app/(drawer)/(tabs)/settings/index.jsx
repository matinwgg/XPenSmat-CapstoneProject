import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';
import ScreenHeader from '../../../../components/ScreenHeader';
import { signOut } from '../../../../lib/appwrite';
import { useGlobalContext } from '../../../../context/GlobalProvider';
import { getDisplayName, getInitials } from '../../../../lib/format';

const SettingRow = ({
  icon,
  label,
  value,
  valueColor,
  onPress,
  right,
  isLast = false,
}) => {
  const content = (
    <View
      className={`flex-row items-center px-4 py-3.5 ${
        isLast ? '' : 'border-b border-[#F1F5F9]'
      }`}
    >
      <View className="w-9 h-9 rounded-xl bg-[#EEF2FF] items-center justify-center">
        <Ionicons name={icon} size={18} color="#1F41BB" />
      </View>

      <Text className="flex-1 ml-3 text-[15px] font-pregular text-[#0F172A]">
        {label}
      </Text>

      {value ? (
        <Text
          className="text-[12px] font-pregular mr-1 max-w-[120px]"
          style={{ color: valueColor || '#64748B' }}
          numberOfLines={1}
        >
          {value}
        </Text>
      ) : null}

      {right || (onPress ? (
        <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
      ) : null)}
    </View>
  );

  if (!onPress) return content;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} accessibilityRole="button">
      {content}
    </TouchableOpacity>
  );
};

const Section = ({ title, children }) => (
  <View className="mb-5">
    <Text className="text-[11px] font-psemibold text-[#94A3B8] uppercase ml-1 mb-2 tracking-wider">
      {title}
    </Text>
    <View
      className="bg-white rounded-2xl overflow-hidden"
      style={{
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 1,
      }}
    >
      {children}
    </View>
  </View>
);

const Settings = () => {
  const {
    user,
    setUser,
    setIsLoggedIn,
    city,
    country,
    globalCurrency,
    isUserVerified,
  } = useGlobalContext();

  const [form, setForm] = useState({
    emailNotifications: true,
    pushNotifications: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const logout = async () => {
    setIsSubmitting(true);
    try {
      await signOut();
      setUser(null);
      setIsLoggedIn(false);
      router.replace('/sign-in');
    } catch (error) {
      console.log('Appwrite service :: logOut() :: ' + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const locationValue =
    (user?.city && user.city !== 'city') || (user?.country && user.country !== 'country')
      ? `${user?.city && user.city !== 'city' ? user.city : city}, ${
          user?.country && user.country !== 'country' ? user.country : country
        }`
      : 'Not set';

  const currencyValue =
    globalCurrency?.name && globalCurrency.name !== 'currency'
      ? globalCurrency.name
      : globalCurrency?.currency || 'GHS';

  return (
    <>
      <Drawer.Screen options={{ title: 'Settings', headerShown: false }} />

      <SafeAreaView className="flex-1 bg-[#F5F7FB]" edges={['top']}>
        <View className="flex-1 px-4">
          <ScreenHeader
            title="Settings"
            subtitle="Manage your account and preferences"
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            <TouchableOpacity
              onPress={() => router.push('/settings/profile')}
              activeOpacity={0.8}
              className="flex-row items-center bg-white rounded-2xl p-4 mb-5"
              style={{
                shadowColor: '#0F172A',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.04,
                shadowRadius: 10,
                elevation: 1,
              }}
              accessibilityRole="button"
            >
              <View className="w-14 h-14 rounded-full bg-[#EEF2FF] items-center justify-center">
                <Text className="text-[#1F41BB] font-psemibold text-[18px]">
                  {getInitials(user?.firstName, user?.lastName, user?.username, user?.email)}
                </Text>
              </View>

              <View className="flex-1 ml-3">
                <Text
                  className="text-[16px] font-psemibold text-[#0F172A]"
                  numberOfLines={1}
                >
                  {getDisplayName(user)}
                </Text>
                <Text
                  className="text-[12px] font-pregular text-[#64748B] mt-0.5"
                  numberOfLines={1}
                >
                  {user?.email || 'No email on file'}
                </Text>
                <View className="flex-row items-center mt-1.5">
                  <View
                    className="w-1.5 h-1.5 rounded-full mr-1"
                    style={{ backgroundColor: isUserVerified ? '#16A34A' : '#D97706' }}
                  />
                  <Text
                    className="text-[11px] font-pmedium"
                    style={{ color: isUserVerified ? '#16A34A' : '#B45309' }}
                  >
                    {isUserVerified ? 'Email verified' : 'Email not verified'}
                  </Text>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
            </TouchableOpacity>

            <Section title="Preferences">
              <SettingRow
                icon="location-outline"
                label="Location"
                value={locationValue}
                onPress={() => router.push('/settings/location')}
              />
              <SettingRow
                icon="cash-outline"
                label="Currency"
                value={currencyValue}
                onPress={() => router.push('/settings/currency')}
              />
              <SettingRow
                icon="mail-outline"
                label="Email notifications"
                right={
                  <Switch
                    onValueChange={(emailNotifications) =>
                      setForm({ ...form, emailNotifications })
                    }
                    value={form.emailNotifications}
                    trackColor={{ false: '#E2E8F0', true: '#1F41BB' }}
                    thumbColor="#FFFFFF"
                  />
                }
              />
              <SettingRow
                icon="notifications-outline"
                label="Push notifications"
                isLast
                right={
                  <Switch
                    onValueChange={(pushNotifications) =>
                      setForm({ ...form, pushNotifications })
                    }
                    value={form.pushNotifications}
                    trackColor={{ false: '#E2E8F0', true: '#1F41BB' }}
                    thumbColor="#FFFFFF"
                  />
                }
              />
            </Section>

            <Section title="Account">
              <SettingRow
                icon="shield-checkmark-outline"
                label="Verification status"
                value={isUserVerified ? 'Verified' : 'Not verified'}
                valueColor={isUserVerified ? '#16A34A' : '#B45309'}
                onPress={() =>
                  router.push({
                    pathname: '/settings/verify-email',
                    params: { email: user?.email },
                  })
                }
              />
              <SettingRow
                icon="chatbubble-ellipses-outline"
                label="Contact us"
                onPress={() =>
                  router.push({
                    pathname: '/settings/contact-report-terms',
                    params: { type: 'contact' },
                  })
                }
              />
              <SettingRow
                icon="bug-outline"
                label="Report a bug"
                onPress={() =>
                  router.push({
                    pathname: '/settings/contact-report-terms',
                    params: { type: 'report' },
                  })
                }
              />
              <SettingRow
                icon="document-text-outline"
                label="Terms and privacy"
                isLast
                onPress={() =>
                  router.push({
                    pathname: '/settings/contact-report-terms',
                    params: { type: 'terms' },
                  })
                }
              />
            </Section>

            <TouchableOpacity
              onPress={logout}
              disabled={isSubmitting}
              activeOpacity={0.8}
              className="bg-white rounded-2xl py-4 items-center flex-row justify-center"
              accessibilityRole="button"
              accessibilityLabel="Log out"
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#DC2626" />
              ) : (
                <>
                  <Ionicons name="log-out-outline" size={19} color="#DC2626" />
                  <Text className="text-[#DC2626] font-psemibold text-[15px] ml-2">
                    Log out
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <Text className="text-center text-[11px] font-pregular text-[#94A3B8] mt-5">
              XPenSmat · Version 1.0
            </Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Settings;
