import { TouchableOpacity, View, Image } from 'react-native';
import React from 'react';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import FeatherIcon from '@expo/vector-icons/Feather';

/**
 * Drawer trigger used in screen headers. Rendered as a 44x44 target so it is
 * comfortable to hit on a phone.
 */
const OnToggleDrawer = ({ appLogo }) => {
  const navigation = useNavigation();

  const onToggle = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View>
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.7}
        className="w-11 h-11 rounded-xl bg-[#EEF2FF] items-center justify-center"
        accessibilityRole="button"
        accessibilityLabel="Open menu"
      >
        {appLogo ? (
          <Image
            source={appLogo}
            className="w-9 h-9 rounded-[18px]"
            resizeMode="contain"
          />
        ) : (
          <FeatherIcon color="#1F41BB" name="menu" size={22} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default OnToggleDrawer;
