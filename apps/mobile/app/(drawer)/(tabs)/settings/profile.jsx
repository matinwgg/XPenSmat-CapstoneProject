import React, { useMemo, useState } from 'react';
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
import { Drawer } from 'expo-router/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CountryPicker } from 'react-native-country-codes-picker';
import ScreenHeader from '../../../../components/ScreenHeader';
import TextField from '../../../../components/TextField';
import CustomButton from '../../../../components/CustomButton';
import { alterDetails, getDocumentId } from '../../../../lib/appwrite';
import { useGlobalContext } from '../../../../context/GlobalProvider';
import {
  digitsOnly,
  getInitials,
  splitPhoneNumber,
} from '../../../../lib/format';

const EditProfileScreen = () => {
  const { user, setUser } = useGlobalContext();
  const initialPhone = useMemo(
    () => splitPhoneNumber(user?.phone),
    [user?.phone]
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    countryCode: initialPhone.countryCode,
    countryFlag: '🇬🇭',
    phoneNumber: initialPhone.phoneNumber,
  });

  const setField = (key, value) => {
    setError('');
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const startEditing = () => {
    setForm((previous) => ({ ...previous }));
    setIsEditing(true);
  };

  const cancelEditing = () => {
    const phone = splitPhoneNumber(user?.phone);
    setForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      countryCode: phone.countryCode,
      countryFlag: form.countryFlag,
      phoneNumber: phone.phoneNumber,
    });
    setError('');
    setIsEditing(false);
  };

  const submit = async () => {
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const localNumber = digitsOnly(form.phoneNumber);

    if (!firstName) {
      setError('First name cannot be empty.');
      return;
    }

    if (localNumber && (localNumber.length < 6 || localNumber.length > 12)) {
      setError('Enter a valid phone number (6–12 digits).');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const documentId = await getDocumentId();
      if (!documentId) {
        throw new Error('We could not find your profile record.');
      }

      const updates = {};

      if (firstName !== (user?.firstName || '')) {
        await alterDetails.setFName(documentId, firstName);
        updates.firstName = firstName;
      }

      if (lastName !== (user?.lastName || '')) {
        await alterDetails.setLName(documentId, lastName);
        updates.lastName = lastName;
      }

      if (localNumber) {
        const fullPhone = `${form.countryCode}${localNumber}`;
        if (fullPhone !== user?.phone) {
          await alterDetails.setPhone(documentId, fullPhone);
        }
        updates.phone = fullPhone;
      }

      if (Object.keys(updates).length === 0) {
        setIsEditing(false);
        return;
      }

      setUser((previous) => ({ ...previous, ...updates }));
      setIsEditing(false);
      Alert.alert('Profile updated', 'Your details were saved.');
    } catch (saveError) {
      setError(
        saveError?.message || 'We could not save your details. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Drawer.Screen options={{ title: 'Profile', headerShown: false }} />

      <SafeAreaView className="flex-1 bg-[#F5F7FB]" edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <View className="flex-1 px-4">
            <ScreenHeader
              title="Your profile"
              subtitle="Keep your personal details up to date"
              showBack
              onBack={() => router.back()}
              right={
                isEditing ? null : (
                  <TouchableOpacity
                    onPress={startEditing}
                    activeOpacity={0.8}
                    className="w-11 h-11 rounded-xl bg-[#EEF2FF] items-center justify-center"
                    accessibilityRole="button"
                    accessibilityLabel="Edit profile"
                  >
                    <Ionicons name="create-outline" size={20} color="#1F41BB" />
                  </TouchableOpacity>
                )
              }
            />

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              <View
                className="bg-white rounded-2xl p-5 mb-4 items-center"
                style={{
                  shadowColor: '#0F172A',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.04,
                  shadowRadius: 10,
                  elevation: 1,
                }}
              >
                <View className="w-20 h-20 rounded-full bg-[#EEF2FF] items-center justify-center">
                  <Text className="text-[#1F41BB] font-psemibold text-2xl">
                    {getInitials(
                      user?.firstName,
                      user?.lastName,
                      user?.username,
                      user?.email
                    )}
                  </Text>
                </View>

                <Text className="text-[18px] font-psemibold text-[#0F172A] mt-3">
                  {[user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
                    user?.username ||
                    'Your profile'}
                </Text>
                <Text className="text-[12px] font-pregular text-[#64748B] mt-0.5">
                  @{user?.username || 'user'}
                </Text>
              </View>

              <View
                className="bg-white rounded-2xl p-4"
                style={{
                  shadowColor: '#0F172A',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.04,
                  shadowRadius: 10,
                  elevation: 1,
                }}
              >
                <Text className="text-[11px] font-psemibold text-[#94A3B8] uppercase mb-3 tracking-wider">
                  Personal information
                </Text>

                <Text className="text-[12px] font-pmedium text-[#64748B] mb-1.5 ml-1">
                  First name
                </Text>
                <TextField
                  value={form.firstName}
                  placeholder={user?.firstName || 'First name'}
                  handleTextChange={(value) => setField('firstName', value)}
                  editable={isEditing}
                  autoCapitalize="words"
                  containerStyle="mb-3"
                />

                <Text className="text-[12px] font-pmedium text-[#64748B] mb-1.5 ml-1">
                  Last name
                </Text>
                <TextField
                  value={form.lastName}
                  placeholder={user?.lastName || 'Last name'}
                  handleTextChange={(value) => setField('lastName', value)}
                  editable={isEditing}
                  autoCapitalize="words"
                  containerStyle="mb-3"
                />

                <Text className="text-[12px] font-pmedium text-[#64748B] mb-1.5 ml-1">
                  Phone number
                </Text>
                <View className="flex-row items-start">
                  <TouchableOpacity
                    activeOpacity={isEditing ? 0.7 : 1}
                    onPress={() => (isEditing ? setShowCountryPicker(true) : null)}
                    className="mr-2"
                    accessibilityRole="button"
                    accessibilityLabel="Choose country dial code"
                  >
                    <View
                      pointerEvents="none"
                      style={{ width: 96 }}
                    >
                      <TextField
                        value={`${form.countryFlag} ${form.countryCode}`}
                        editable={false}
                        placeholder="+000"
                      />
                    </View>
                  </TouchableOpacity>

                  <View style={{ flex: 1 }}>
                    <TextField
                      value={form.phoneNumber}
                      placeholder="55 123 4567"
                      handleTextChange={(value) => setField('phoneNumber', value)}
                      editable={isEditing}
                      keyType="phone-pad"
                    />
                  </View>
                </View>

                <Text className="text-[12px] font-pmedium text-[#64748B] mb-1.5 ml-1 mt-3">
                  Username
                </Text>
                <TextField value={user?.username || ''} editable={false} />

                <Text className="text-[12px] font-pmedium text-[#64748B] mb-1.5 ml-1 mt-3">
                  Email
                </Text>
                <TextField value={user?.email || ''} editable={false} />

                {error ? (
                  <View className="flex-row items-start bg-[#FEE2E2] rounded-xl p-3 mt-4">
                    <Ionicons
                      name="alert-circle-outline"
                      size={16}
                      color="#B91C1C"
                      style={{ marginTop: 1 }}
                    />
                    <Text className="flex-1 text-[12px] font-pregular text-[#991B1B] ml-2 leading-5">
                      {error}
                    </Text>
                  </View>
                ) : null}

                {isEditing ? (
                  <>
                    <CustomButton
                      title="Save changes"
                      handlePress={submit}
                      isLoading={isSubmitting}
                      containerStyles="mt-5"
                    />
                    <TouchableOpacity
                      onPress={cancelEditing}
                      disabled={isSubmitting}
                      activeOpacity={0.7}
                      className="items-center py-3 mt-1"
                      accessibilityRole="button"
                    >
                      <Text className="text-[13px] font-pmedium text-[#64748B]">
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View className="flex-row items-start bg-[#F8FAFC] rounded-xl p-3 mt-4">
                    <Ionicons
                      name="lock-closed-outline"
                      size={15}
                      color="#64748B"
                      style={{ marginTop: 1 }}
                    />
                    <Text className="flex-1 text-[12px] font-pregular text-[#475569] ml-2 leading-5">
                      Your username and email cannot be changed here. Tap the
                      pencil to update your name or phone number.
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>

        <CountryPicker
          show={showCountryPicker}
          pickerButtonOnPress={(item) => {
            setField('countryCode', item.dial_code);
            setField('countryFlag', item.flag);
            setShowCountryPicker(false);
          }}
          onBackdropPress={() => setShowCountryPicker(false)}
          style={{ modal: { height: 600, width: '90%' } }}
        />
      </SafeAreaView>
    </>
  );
};

export default EditProfileScreen;
