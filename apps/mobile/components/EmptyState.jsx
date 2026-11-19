import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { images } from '../constants';

/**
 * Shared empty state. `actionLabel`/`onAction` are optional so existing call
 * sites keep working, while new screens can offer a way out of the dead end.
 */
const EmptyState = ({
  title = 'Nothing here yet',
  subtitle = 'Your transactions will appear here once you add one.',
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <View className="items-center justify-center px-8 py-10">
      {icon ? (
        <View className="w-20 h-20 rounded-full bg-[#EEF2FF] items-center justify-center mb-2">
          <Ionicons name={icon} size={34} color="#1F41BB" />
        </View>
      ) : (
        <Image
          source={images.empty}
          className="w-[210px] h-[170px]"
          resizeMode="contain"
        />
      )}

      <Text className="font-psemibold text-lg text-[#0F172A] text-center mt-4">
        {title}
      </Text>
      {subtitle ? (
        <Text className="text-sm font-pregular text-[#64748B] text-center mt-1.5 leading-5">
          {subtitle}
        </Text>
      ) : null}

      {actionLabel && onAction ? (
        <TouchableOpacity
          onPress={onAction}
          activeOpacity={0.85}
          className="mt-6 bg-[#1F41BB] rounded-xl px-6 py-3"
          accessibilityRole="button"
        >
          <Text className="text-white font-psemibold text-sm">{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default EmptyState;
