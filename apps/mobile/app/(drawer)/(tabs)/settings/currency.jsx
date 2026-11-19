import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';
import ScreenHeader from '../../../../components/ScreenHeader';
import CustomButton from '../../../../components/CustomButton';
import CurrencyPicker from '../../../../partials/CurrencyPicker';
import { alterDetails, getDocumentId } from '../../../../lib/appwrite';
import { useGlobalContext } from '../../../../context/GlobalProvider';

const CurrencyScreen = () => {
  const { globalCurrency } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    setIsLoading(true);

    try {
      const documentId = await getDocumentId();
      if (!documentId) {
        throw new Error('We could not find your profile record.');
      }

      await alterDetails.setCurrency(documentId, globalCurrency.name);
      Alert.alert('Currency updated', 'New amounts will use this currency.');
      router.back();
    } catch (error) {
      Alert.alert(
        'Could not save currency',
        error?.message || 'Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Drawer.Screen options={{ title: 'Currency', headerShown: false }} />

      <SafeAreaView className="flex-1 bg-[#F5F7FB]" edges={['top']}>
        <View className="flex-1 px-4">
          <ScreenHeader
            title="Currency"
            subtitle="Choose how amounts are displayed"
            showBack
            onBack={() => router.back()}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <View
              className="rounded-2xl p-5 mb-4"
              style={{ backgroundColor: '#1F41BB' }}
            >
              <View className="flex-row items-center justify-between">
                <Text
                  className="text-[11px] font-psemibold uppercase"
                  style={{ color: 'rgba(255,255,255,0.72)' }}
                >
                  Selected currency
                </Text>
                <Ionicons name="cash-outline" size={18} color="#FFFFFF" />
              </View>

              <View className="flex-row items-end mt-2">
                <Text className="text-[30px] font-pbold text-white mr-2">
                  {globalCurrency?.symbol || globalCurrency?.currency || 'GHS'}
                </Text>
                <Text className="text-[18px] font-psemibold text-white mb-1.5">
                  {globalCurrency?.currency || 'GHS'}
                </Text>
              </View>

              <Text
                className="text-[12px] font-pregular mt-1"
                style={{ color: 'rgba(255,255,255,0.78)' }}
              >
                {globalCurrency?.name && globalCurrency.name !== 'currency'
                  ? globalCurrency.name
                  : 'Default currency'}
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
              <Text className="text-[12px] font-pmedium text-[#64748B] mb-2 ml-1">
                Change currency
              </Text>

              <CurrencyPicker />

              <View className="flex-row items-start bg-[#F8FAFC] rounded-xl p-3 mt-4">
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color="#64748B"
                  style={{ marginTop: 1 }}
                />
                <Text className="flex-1 text-[12px] font-pregular text-[#475569] ml-2 leading-5">
                  Existing transactions are not converted. The new currency is
                  used for the amounts you add from now on.
                </Text>
              </View>

              <CustomButton
                title="Save currency"
                handlePress={submit}
                isLoading={isLoading}
                containerStyles="mt-5"
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default CurrencyScreen;
