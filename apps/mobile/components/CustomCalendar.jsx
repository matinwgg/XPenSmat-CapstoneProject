import { View, Text } from 'react-native';
import React from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';

/**
 * Compact week strip used on the home dashboard. The "Today" label is part of
 * the layout instead of an absolutely-positioned overlay, so it can never
 * collide with the calendar controls.
 */
const CustomCalendar = () => {
  const getCurrentMonthStartAndEnd = () => {
    const startOfMonth = moment();
    const endOfMonth = moment();
    return {
      start: startOfMonth,
      end: endOfMonth,
    };
  };

  const { start, end } = getCurrentMonthStartAndEnd();

  const datesWhitelist = [
    {
      start,
      end,
    },
  ];

  const currentDate = moment().format('YYYY-MM-DD');

  return (
    <View className="pt-2">
      <View className="flex-row items-center justify-between px-3 mb-1">
        <View className="bg-[#EEF2FF] px-2.5 py-1 rounded-lg">
          <Text className="text-[11px] font-psemibold text-[#1F41BB]">Today</Text>
        </View>
        <Text className="text-[12px] font-pregular text-[#64748B]">
          {moment().format('MMMM YYYY')}
        </Text>
      </View>

      <CalendarStrip
        calendarAnimation={{ type: 'sequence', duration: 30 }}
        daySelectionAnimation={{
          type: 'background',
          duration: 200,
          highlightColor: '#EEF2FF',
        }}
        style={{
          height: 112,
          paddingTop: 4,
          paddingBottom: 12,
        }}
        calendarHeaderStyle={{
          color: '#0F172A',
          fontFamily: 'Brighter-Bold',
          fontSize: 15,
          paddingLeft: 4,
          paddingBottom: 4,
        }}
        dateNumberStyle={{
          color: '#0F172A',
          fontFamily: 'Poppins-Medium',
          fontSize: 14,
          paddingTop: 2,
        }}
        dateNameStyle={{
          color: '#64748B',
          fontFamily: 'Poppins-Regular',
          fontSize: 11,
        }}
        highlightDateNumberStyle={{
          color: '#FFFFFF',
          fontFamily: 'Brighter-Bold',
          fontSize: 15,
          backgroundColor: '#1F41BB',
          borderRadius: 10,
          overflow: 'hidden',
          paddingVertical: 4,
          paddingHorizontal: 7,
          textAlign: 'center',
        }}
        highlightDateNameStyle={{
          color: '#1F41BB',
          fontFamily: 'Poppins-Medium',
          fontSize: 11,
        }}
        disabledDateNameStyle={{ color: '#CBD5E1' }}
        disabledDateNumberStyle={{ color: '#CBD5E1' }}
        datesWhitelist={datesWhitelist}
        iconLeft={require('../assets/icons/left--arrow.png')}
        iconRight={require('../assets/icons/right--arrow.png')}
        iconContainer={{ flex: 0.1 }}
        markedDates={[]}
        selectedDate={currentDate}
      />
    </View>
  );
};

export default CustomCalendar;
