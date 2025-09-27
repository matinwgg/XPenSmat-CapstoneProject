import { StyleSheet, View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import getSymbolFromCurrency from 'currency-symbol-map';
import { Picker } from '@react-native-picker/picker';
import { currencyData } from './currencyData';
import { useGlobalContext } from '../context/GlobalProvider';

const CurrencyPicker = () => {
  const { user, setUser, setCurrency } = useGlobalContext();

  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    if (currencyData && currencyData.countries) {
      setCurrencies(currencyData.countries);
    }
  }, []);

  useEffect(() => {
    if (selectedCurrency) {
      const symbol = getSymbolFromCurrency(selectedCurrency);
      const currencyName = currencies.find(currency => currency.code === selectedCurrency)?.currencyName || '';

      setCurrency({
        name: currencyName,
        symbol: symbol,
        currency: selectedCurrency
      });

    }
  }, [selectedCurrency, setCurrency]);

  const handleCurrencyChange = (currencyCode) => {
    setSelectedCurrency(currencyCode);
  };


  return (
    <View style={styles.pickerContainer}>
      <Picker
        style={styles.picker}
        selectedValue={selectedCurrency}
        onValueChange={(itemValue) => handleCurrencyChange(itemValue)}
      >
        {currencies.map((currency, index) => (
          <Picker.Item 
            key={index} 
            label={currency.currencyName} 
            value={currency.code} 
          />
        ))}
      </Picker>
    </View>
  );
};

export default CurrencyPicker;

const styles = StyleSheet.create({
  pickerContainer: {
    marginHorizontal: 10,
    marginBottom: 20,
  },
  picker: {
    height: 20,
    width: '100%',
  },
  symbolContainer: {
    marginTop: 10,
  },
  symbolText: {
    fontSize: 16,
  },
});
