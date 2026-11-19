import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';
import ScreenHeader from '../../../../components/ScreenHeader';
import TextField from '../../../../components/TextField';
import CustomButton from '../../../../components/CustomButton';
import { alterDetails, getDocumentId } from '../../../../lib/appwrite';
import { useGlobalContext } from '../../../../context/GlobalProvider';

const clean = (value) =>
  typeof value === 'string' && value !== 'city' && value !== 'country'
    ? value
    : '';

const LocationScreen = () => {
  const { user, setUser, city, country, setCity, setCountry } =
    useGlobalContext();

  const [form, setForm] = useState({
    city: clean(user?.city) || clean(city),
    country: clean(user?.country) || clean(country),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    const nextCity = form.city.trim();
    const nextCountry = form.country.trim();

    if (!nextCity || !nextCountry) {
      setError('Enter both a city and a country.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const documentId = await getDocumentId();
      if (!documentId) {
        throw new Error('We could not find your profile record.');
      }

      await alterDetails.setCity(documentId, nextCity);
      await alterDetails.setCountry(documentId, nextCountry);

      setCity(nextCity);
      setCountry(nextCountry);
      setUser((previous) => ({
        ...previous,
        city: nextCity,
        country: nextCountry,
      }));

      router.back();
    } catch (saveError) {
      setError(
        saveError?.message || 'We could not save your location. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Drawer.Screen options={{ title: 'Location', headerShown: false }} />

      <SafeAreaView className="flex-1 bg-[#F5F7FB]" edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <View className="flex-1 px-4">
            <ScreenHeader
              title="Location"
              subtitle="Used to personalise your currency suggestions"
              showBack
              onBack={() => router.back()}
            />

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 40 }}
            >
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
                <View className="flex-row items-center mb-4">
                  <View className="w-10 h-10 rounded-xl bg-[#EEF2FF] items-center justify-center">
                    <Ionicons name="location-outline" size={19} color="#1F41BB" />
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-[15px] font-psemibold text-[#0F172A]">
                      Where are you based?
                    </Text>
                    <Text className="text-[12px] font-pregular text-[#64748B] mt-0.5">
                      This is shown in your settings only.
                    </Text>
                  </View>
                </View>

                <Text className="text-[12px] font-pmedium text-[#64748B] mb-1.5 ml-1">
                  City
                </Text>
                <TextField
                  value={form.city}
                  placeholder="e.g. Accra"
                  handleTextChange={(value) =>
                    setForm((previous) => ({ ...previous, city: value }))
                  }
                  autoCapitalize="words"
                  containerStyle="mb-3"
                />

                <Text className="text-[12px] font-pmedium text-[#64748B] mb-1.5 ml-1">
                  Country
                </Text>
                <TextField
                  value={form.country}
                  placeholder="e.g. Ghana"
                  handleTextChange={(value) =>
                    setForm((previous) => ({ ...previous, country: value }))
                  }
                  autoCapitalize="words"
                />

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

                <CustomButton
                  title="Save location"
                  handlePress={submit}
                  isLoading={isLoading}
                  containerStyles="mt-5"
                />
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default LocationScreen;
