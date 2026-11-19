import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import CountryFlag from 'react-native-country-flag';
import Ionicons from '@expo/vector-icons/Ionicons';
import getSymbolFromCurrency from 'currency-symbol-map';
import ScreenHeader from '../../components/ScreenHeader';
import TextField from '../../components/TextField';
import { formatAmount } from '../../lib/format';

const FALLBACK_CURRENCIES = [
  'USD',
  'GHS',
  'EUR',
  'GBP',
  'NGN',
  'KES',
  'ZAR',
  'CAD',
  'AUD',
  'JPY',
  'CNY',
  'INR',
];

const isoCode = (currency) => String(currency || 'US').slice(0, 2).toLowerCase();

const ConvertBtwnCurrencies = () => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('GHS');
  const [rates, setRates] = useState({});
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadRates = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/0e6303693a5b845f4814341f/latest/${fromCurrency}`
        );
        const payload = await response.json();
        if (isMounted) {
          setRates(payload?.conversion_rates || {});
        }
      } catch (requestError) {
        if (isMounted) {
          setRates({});
          setError('Live rates are unavailable. Check your connection.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadRates();
    return () => {
      isMounted = false;
    };
  }, [fromCurrency]);

  const currencies = useMemo(() => {
    const keys = Object.keys(rates);
    return keys.length > 0 ? keys : FALLBACK_CURRENCIES;
  }, [rates]);

  const exchangeRate = Number(rates?.[toCurrency]) || 0;
  const numericAmount = Number(amount) || 0;
  const converted = numericAmount * exchangeRate;

  const fromSymbol = getSymbolFromCurrency(fromCurrency) || fromCurrency;
  const toSymbol = getSymbolFromCurrency(toCurrency) || toCurrency;

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F5F7FB]" edges={['top']}>
      <View className="flex-1 px-4">
        <ScreenHeader
          title="Currency converter"
          subtitle="Check live exchange rates"
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            className="bg-white rounded-2xl p-4 mb-4"
            style={{
              shadowColor: '#0F172A',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 12,
              elevation: 2,
            }}
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-[12px] font-psemibold text-[#64748B] uppercase">
                From
              </Text>
              <View className="flex-row items-center">
                <CountryFlag isoCode={isoCode(fromCurrency)} size={13} />
                <Text className="ml-1.5 text-[12px] font-pmedium text-[#64748B]">
                  {fromCurrency}
                </Text>
              </View>
            </View>

            <TextField
              value={amount}
              placeholder="0.00"
              prefix={fromSymbol}
              keyType="decimal-pad"
              handleTextChange={setAmount}
              inputStyle={{ fontSize: 22, fontFamily: 'Poppins-SemiBold' }}
            />

            <View className="mt-3 border border-[#E2E8F0] rounded-[14px] overflow-hidden">
              <Picker
                selectedValue={fromCurrency}
                onValueChange={(value) => setFromCurrency(value)}
                dropdownIconColor="#64748B"
                style={{ height: 50, color: '#0F172A' }}
              >
                {currencies.map((currency) => (
                  <Picker.Item
                    key={`from-${currency}`}
                    label={currency}
                    value={currency}
                  />
                ))}
              </Picker>
            </View>

            <View className="items-center my-2">
              <TouchableOpacity
                onPress={swapCurrencies}
                activeOpacity={0.85}
                className="w-11 h-11 rounded-full bg-[#EEF2FF] items-center justify-center border border-white"
                style={{ marginTop: -26, marginBottom: -4 }}
                accessibilityRole="button"
                accessibilityLabel="Swap currencies"
              >
                <Ionicons name="swap-vertical" size={20} color="#1F41BB" />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-[12px] font-psemibold text-[#64748B] uppercase">
                To
              </Text>
              <View className="flex-row items-center">
                <CountryFlag isoCode={isoCode(toCurrency)} size={13} />
                <Text className="ml-1.5 text-[12px] font-pmedium text-[#64748B]">
                  {toCurrency}
                </Text>
              </View>
            </View>

            <TextField
              value={formatAmount(converted)}
              prefix={toSymbol}
              editable={false}
              inputStyle={{ fontSize: 22, fontFamily: 'Poppins-SemiBold' }}
            />

            <View className="mt-3 border border-[#E2E8F0] rounded-[14px] overflow-hidden">
              <Picker
                selectedValue={toCurrency}
                onValueChange={(value) => setToCurrency(value)}
                dropdownIconColor="#64748B"
                style={{ height: 50, color: '#0F172A' }}
              >
                {currencies.map((currency) => (
                  <Picker.Item
                    key={`to-${currency}`}
                    label={currency}
                    value={currency}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View
            className="rounded-2xl p-4"
            style={{ backgroundColor: '#1F41BB' }}
          >
            <View className="flex-row items-center justify-between">
              <Text
                className="text-[12px] font-psemibold uppercase"
                style={{ color: 'rgba(255,255,255,0.72)' }}
              >
                Converted amount
              </Text>
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="flash-outline" size={16} color="#FFFFFF" />
              )}
            </View>

            <Text
              className="text-[30px] font-pbold text-white mt-1"
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {toSymbol}
              {formatAmount(converted)}
            </Text>

            <Text
              className="text-[12px] font-pregular mt-1"
              style={{ color: 'rgba(255,255,255,0.78)' }}
            >
              1 {fromCurrency} = {formatAmount(exchangeRate, 4)} {toCurrency}
            </Text>
          </View>

          {error ? (
            <View className="flex-row items-start bg-[#FEF3C7] rounded-xl p-3 mt-4">
              <Ionicons name="alert-circle-outline" size={16} color="#B45309" />
              <Text className="flex-1 text-[12px] font-pregular text-[#92400E] ml-2 leading-5">
                {error}
              </Text>
            </View>
          ) : null}

          <Text className="text-[11px] font-pregular text-[#94A3B8] text-center mt-4">
            Rates are provided by exchangerate-api.com and refresh when the
            source currency changes.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ConvertBtwnCurrencies;
