import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';


const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const BottomSheet = ({ text, line}) => {
  return (
      <View style={styles.bottomSheetContainer}>
        <View style={styles.line}></View>

    </View>
  );
}

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: SCREEN_HEIGHT / 6,
    borderRadius: 25,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 2,
  },
});

export default BottomSheet;
