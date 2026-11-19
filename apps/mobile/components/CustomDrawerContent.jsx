import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, usePathname } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGlobalContext } from '../context/GlobalProvider';
import { signOut } from '../lib/appwrite';
import { getDisplayName, getInitials } from '../lib/format';

const MENU_ITEMS = [
  { label: 'Home', href: '/home', icon: 'home' },
  { label: 'All transactions', href: '/all-expense', icon: 'receipt' },
  { label: 'Statistics', href: '/statistics', icon: 'bar-chart' },
  { label: 'Convert currency', href: '/currency-converter', icon: 'repeat' },
  { label: 'Profile', href: '/settings/profile', icon: 'person' },
];

const MenuItem = ({ icon, label, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    className={`flex-row items-center px-4 py-3 rounded-xl mb-1 ${
      active ? 'bg-[#EEF2FF]' : ''
    }`}
    accessibilityRole="button"
    accessibilityState={{ selected: active }}
  >
    <View
      className={`w-9 h-9 rounded-xl items-center justify-center ${
        active ? 'bg-[#1F41BB]' : 'bg-[#F1F5F9]'
      }`}
    >
      <Ionicons name={icon} size={18} color={active ? '#FFFFFF' : '#64748B'} />
    </View>
    <Text
      className={`ml-3 text-[15px] ${
        active
          ? 'font-psemibold text-[#1F41BB]'
          : 'font-pregular text-[#0F172A]'
      }`}
    >
      {label}
    </Text>
    {active ? (
      <View className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1F41BB]" />
    ) : null}
  </TouchableOpacity>
);

export default function CustomDrawerContent() {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { top, bottom } = useSafeAreaInsets();
  const pathname = usePathname();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const isActive = (href) => {
    if (href === '/home') return !pathname || pathname === '/' || pathname.includes('/home');
    return pathname === href || pathname.startsWith(`${href}/`) || pathname.includes(href);
  };

  const logout = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      setUser(null);
      setIsLoggedIn(false);
      router.replace('/sign-in');
    } finally {
      setIsSigningOut(false);
    }
  };

  const initials = getInitials(
    user?.firstName,
    user?.lastName,
    user?.username,
    user?.email
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View
        style={{
          backgroundColor: '#1F41BB',
          paddingTop: top + 24,
          paddingHorizontal: 20,
          paddingBottom: 22,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <View className="flex-row items-center">
          <View
            className="w-16 h-16 rounded-full items-center justify-center border"
            style={{
              backgroundColor: 'rgba(255,255,255,0.18)',
              borderColor: 'rgba(255,255,255,0.3)',
            }}
          >
            <Text className="text-white font-psemibold text-xl">{initials}</Text>
          </View>
          <View className="flex-1 ml-3.5">
            <Text className="text-white font-psemibold text-lg" numberOfLines={1}>
              {getDisplayName(user)}
            </Text>
            <Text
              className="font-pregular text-xs mt-0.5"
              style={{ color: 'rgba(255,255,255,0.75)' }}
              numberOfLines={1}
            >
              {user?.email || 'No email on file'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.navigate('/settings/profile')}
          activeOpacity={0.85}
          className="flex-row items-center rounded-xl px-3 py-2.5 mt-5 self-start"
          style={{ backgroundColor: 'rgba(255,255,255,0.16)' }}
          accessibilityRole="button"
        >
          <Ionicons name="create-outline" size={15} color="#FFFFFF" />
          <Text className="text-white font-pmedium text-xs ml-2">Edit profile</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[11px] font-psemibold text-[#94A3B8] uppercase tracking-wider ml-4 mb-2">
          Menu
        </Text>
        {MENU_ITEMS.map((item) => (
          <MenuItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            active={isActive(item.href)}
            onPress={() => router.navigate(item.href)}
          />
        ))}
      </ScrollView>

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: bottom + 16,
        }}
      >
        <TouchableOpacity
          onPress={logout}
          disabled={isSigningOut}
          activeOpacity={0.8}
          className="flex-row items-center py-2"
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          {isSigningOut ? (
            <ActivityIndicator size="small" color="#DC2626" />
          ) : (
            <Ionicons name="log-out-outline" size={22} color="#DC2626" />
          )}
          <Text className="text-[#DC2626] font-psemibold text-[15px] ml-3">
            Log out
          </Text>
        </TouchableOpacity>
        <Text className="text-[11px] font-pregular text-[#94A3B8] mt-3">
          XPenSmat · v1.0
        </Text>
      </View>
    </View>
  );
}
