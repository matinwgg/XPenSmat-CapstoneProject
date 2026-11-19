import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import OnToggleDrawer from '../partials/toggle-drawer';

/**
 * Consistent header for screens inside the drawer: an optional menu button
 * (drawer roots) or back button (pushed screens), a title/subtitle and an
 * optional right-hand action.
 */
const ScreenHeader = ({
  title,
  subtitle,
  right,
  className,
  showMenu = true,
  showBack = false,
  onBack,
}) => {
  const showLeading = showBack || showMenu;

  return (
    <View className={`flex-row items-center mb-4 ${className || ''}`}>
      {showBack ? (
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          className="w-11 h-11 rounded-xl bg-[#EEF2FF] items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color="#1F41BB" />
        </TouchableOpacity>
      ) : showMenu ? (
        <OnToggleDrawer />
      ) : null}

      <View className={`flex-1 ${showLeading ? 'ml-3' : ''}`}>
        <Text
          className="text-[22px] font-psemibold text-[#0F172A]"
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            className="text-[13px] font-pregular text-[#64748B] mt-0.5"
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {right ? <View className="ml-2">{right}</View> : null}
    </View>
  );
};

export default ScreenHeader;
