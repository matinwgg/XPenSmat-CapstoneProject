import { View } from 'react-native'
import React, { useState } from 'react'
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import { Text } from 'react-native';

const CustomCalendar = () => {

  const getCurrentMonthStartAndEnd = () => {
    const startOfMonth = moment()//.startOf('month').startOf('week');
    const endOfMonth = moment()//.endOf('month').endOf('week');
    return {
      start: startOfMonth,
      end: endOfMonth,
    };
  };

  const { start, end } = getCurrentMonthStartAndEnd();

    const datesWhitelist = [
        {
        start,
        end //.add(365, 'days') // total 4 days enabled
        }
    ];

  const [markedDate, setMarkedDate] = useState([]);
  const [currentDate, setCurrentDate] = useState(
    `${moment().format('YYYY')}-${moment().format('MM')}-${moment().format(
      'DD'
    )}`
  );

  return (
    <View>
      <View className="absolute top-2.5 left-2 bg-[#cde] py-0.5 px-2 rounded-lg">
        <Text 
            style={ { 
                color: '#006aee', 
                fontFamily: "Poppins-SemiBold",
                }}>Today
          </Text>
      </View>
        <CalendarStrip
          calendarAnimation={{ type: 'sequence', duration: 30 }}
          daySelectionAnimation={{
            type: 'background',
            duration: 200
          }}
          style={{
            height: 150,
            paddingTop: 20,
            paddingBottom: 40
          }}
          calendarHeaderStyle={{ color: '#000', fontFamily: "Brighter-Bold", fontSize: 18, paddingLeft: 10, paddingBottom: 8 }}
          dateNumberStyle={{ color: '#000000', paddingTop: 5 }}
          dateNameStyle={{ color: '#545454' }}
          highlightDateNumberStyle={{
            color: '#fff',
            fontSize: 18,
            fontFamily: "Brighter-Bold",
            backgroundColor: '#2E66E7',
            marginTop: 3,
            height: 50,
            width: 35,
            textAlign: 'center',
            borderRadius: 5,
            overflow: 'hidden',
            paddingTop: 15,
            fontWeight: '400',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          highlightDateNameStyle={{ color: '#2E66E7', paddingTop: -90, fontFamily: "Brighter-Bold", fontSize: 13 }}
          disabledDateNameStyle={{ color: '#5A5A5A' }}
          disabledDateNumberStyle={{ color: '#5A5A5A', paddingTop: 10 }}
          datesWhitelist={datesWhitelist}
          iconLeft={require('../assets/icons/left--arrow.png')}
          iconRight={require('../assets/icons/right--arrow.png')}
          iconContainer={{ flex: 0.1 }}
          // If you get this error => undefined is not an object (evaluating 'datesList[_this.state.numVisibleDays - 1].date')
          // temp: https://github.com/BugiDev/react-native-calendar-strip/issues/303#issuecomment-864510769
          markedDates={markedDate}
          selectedDate={currentDate}
        //   onDateSelected={(date) => {
        //     const selectedDate = `${moment(date).format('YYYY')}-${moment(
        //       date
        //     ).format('MM')}-${moment(date).format('DD')}`;
        //     //updateCurrentTask(selectedDate);
        //     //setCurrentDate(selectedDate);
        //   }}
        />
    </View>
  )
}

export default CustomCalendar
