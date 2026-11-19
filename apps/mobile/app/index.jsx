import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomButton from '../components/CustomButton';
import { images } from '../constants';
import { useGlobalContext } from '../context/GlobalProvider';

const FEATURES = [
  { icon: 'add-circle-outline', label: 'Track' },
  { icon: 'bar-chart-outline', label: 'Analyse' },
  { icon: 'shield-checkmark-outline', label: 'Stay in control' },
];

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center mt-2">
          <View className="w-11 h-11 rounded-2xl bg-[#1F41BB] items-center justify-center">
            <Ionicons name="wallet" size={22} color="#FFFFFF" />
          </View>
          <Text className="ml-3 text-[18px] font-pbold text-[#0F172A]">
            XPenSmat
          </Text>
        </View>

        <View className="mt-8">
          <Text className="text-[38px] leading-[46px] font-pbold text-[#0F172A]">
            Spend smarter,{'\n'}
            <Text className="text-[#1F41BB]">save more.</Text>
          </Text>
          <Text className="text-[14px] font-pregular text-[#64748B] mt-3 leading-6">
            Track every expense, understand where your money goes and make
            confident decisions with clear, simple insights.
          </Text>
        </View>

        <View className="flex-1 items-center justify-center my-4">
          <Image
            source={images.welcome}
            className="w-full h-[280px]"
            resizeMode="contain"
          />
        </View>

        <View className="flex-row justify-between mb-8">
          {FEATURES.map((feature) => (
            <View key={feature.label} className="items-center flex-1">
              <View className="w-10 h-10 rounded-xl bg-[#EEF2FF] items-center justify-center">
                <Ionicons name={feature.icon} size={19} color="#1F41BB" />
              </View>
              <Text className="text-[10px] font-pmedium text-[#64748B] mt-1.5 text-center">
                {feature.label}
              </Text>
            </View>
          ))}
        </View>

        <CustomButton
          title="Get started"
          handlePress={() => router.push('/sign-in')}
          accessibilityLabel="Get started"
        />

        <TouchableOpacity
          onPress={() => router.push('/sign-in')}
          className="self-center mt-5 py-2 px-3"
          accessibilityRole="button"
        >
          <Text className="font-pregular text-[13px] text-[#64748B]">
            Already have an account?{' '}
            <Text className="font-psemibold text-[#1F41BB]">Sign in</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
