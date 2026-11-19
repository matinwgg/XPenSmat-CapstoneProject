import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import getSymbolFromCurrency from 'currency-symbol-map';
import { Dropdown } from 'react-native-element-dropdown';
import { currencyData } from './currencyData';
import { useGlobalContext } from '../context/GlobalProvider';

/**
 * Currency selector used by the settings screen.
 *
 * The previous version kept its own `selectedCurrency` state, so the picker
 * opened empty even when a currency was already active. It now reads and
 * writes the global currency, and the options carry both the code and the
 * human-readable name so the list is searchable.
 */
const CurrencyPicker = () => {
  const { globalCurrency, setCurrency } = useGlobalContext();
  const [isFocus, setIsFocus] = useState(false);

  const options = useMemo(() => {
    const countries = currencyData?.countries || [];
    return countries
      .filter((item) => item?.code)
      .map((item) => ({
        label: `${item.code} — ${item.currencyName || item.code}`,
        value: item.code,
        name: item.currencyName || item.code,
      }));
  }, []);

  const current = globalCurrency?.currency || 'GHS';

  const onChange = (item) => {
    setCurrency({
      name: item.name,
      symbol: getSymbolFromCurrency(item.value) || item.value,
      currency: item.value,
    });
    setIsFocus(false);
  };

  return (
    <View>
      <Dropdown
        style={[styles.dropdown, isFocus && styles.dropdownFocused]}
        containerStyle={styles.container}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selected}
        inputSearchStyle={styles.search}
        itemTextStyle={styles.item}
        activeColor="#EEF2FF"
        iconStyle={{ width: 20, height: 20 }}
        data={options}
        search
        searchPlaceholder="Search currency or code"
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select a currency"
        value={current}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={onChange}
      />

      {globalCurrency?.name && globalCurrency.name !== 'currency' ? (
        <Text style={styles.helper}>
          Symbol {globalCurrency.symbol || '—'} · {globalCurrency.name}
        </Text>
      ) : null}
    </View>
  );
};

export default CurrencyPicker;

const styles = StyleSheet.create({
  dropdown: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  dropdownFocused: {
    borderColor: '#1F41BB',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  placeholder: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#94A3B8',
  },
  selected: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#0F172A',
  },
  search: {
    height: 44,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#0F172A',
    borderRadius: 10,
  },
  item: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#0F172A',
  },
  helper: {
    marginTop: 8,
    marginLeft: 4,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#64748B',
  },
});
