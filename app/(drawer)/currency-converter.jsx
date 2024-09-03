import { SafeAreaView, Text, Image, View, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useRouter } from 'expo-router'
import { Picker } from '@react-native-picker/picker';
import TextField from '../../components/TextField';
import { images } from '../../constants';
import OnToggleDrawer from '../../partials/toggle-drawer';
import CountryFlag from "react-native-country-flag";
import { CURRENCIES } from '../../partials/utils';
import getSymbolFromCurrency from 'currency-symbol-map'

const ConvertBtwnCurrencies = () => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('GHS');
  const [exchangeRate, setExchangeRate] = useState('0');
  const [amount, setAmount] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const router = useRouter();

  const convertCurrency = () => {
    const result = (amount * exchangeRate).toFixed(2)
      return result;
  };

  const getFlagByCode = (code) => {
    return code.substring(0, 2)
  }

  function getCountryByCurrency(currencyCode) {
    return CURRENCIES[currencyCode] || 'Currency not found';
  }

useEffect(() => {
  const fetchCurrencies = async () => {
   try {
     const response = await fetch(
       'https://v6.exchangerate-api.com/v6/0e6303693a5b845f4814341f/latest/USD' //api
      );

      const data = await response.json();
    setCurrencies(Object.keys(data.conversion_rates));
    setExchangeRate(data.conversion_rates[toCurrency]);
  }	catch (error) {
	  console.log(error);
  }
};

fetchCurrencies();
}, [toCurrency]);
  

useEffect(() => {
  const fetchExchangeRates = async () => {
   try {
     const response = await fetch(
       'https://v6.exchangerate-api.com/v6/0e6303693a5b845f4814341f/latest/${fromCurrency}'
      );

      const data = await response.json();
	    setExchangeRate(data.conversion_rates[toCurrency]);
  }	catch (error) {
	console.log(error);
  }
 };
 fetchExchangeRates();
 }, [fromCurrency, toCurrency]);


   return (
    <>
    <SafeAreaView className="flex-1">
    <View style={{ flex:1, justifyContent: "center", alignItems: 'center', marginTop: -130}}>
    <View className='self-start ml-5 -mt-5 mb-4'>
        <OnToggleDrawer />
      </View>
      <Image 
      source={images.change} 
      style={{
        maxWidth:200,
        maxHeight:200,
        marginBottom: 20,
        objectFit: 'fill'
      }}
      />
        <Text className="text-[#1F41BB] font-mbold text-4xl">Currency Converter</Text>
        {/* <Text className="text-md mb-5 font-pregular">Check live rates</Text> */} 


        <View className="flex-row mx-10 mt-[50px]">
          <View>
          <View className="flex-row ml-3">
              <Text className="font-pbold text-xl ">Amount</Text>
            </View>

              <TextField 
                containerStyle="w-40 rounded-xl"
                value={amount}
                //placeholderStyle={}
                placeholder={"Enter Amount"}
                handleTextChange={setAmount}
                keyType='numeric'
                currency={fromCurrency}
                />

              <View className="absolute top-11 left-[140px]">
                <CountryFlag isoCode={getFlagByCode(fromCurrency).toLowerCase().toString()} size={14} />
              </View>
          </View>     
            <View>   
              <Text className="font-pbold text-xl ml-2">Converted amount</Text>
              <View className="flex"> 
                <TextField 
                  containerStyle="w-40 rounded-xl"
                  value={convertCurrency()}
                  placeholder={""}
                  editable={false}
                  //handleTextChange={setAmount}
                  keybsType='numeric'
                  currency={toCurrency}
                />
                <View className="absolute top-5 left-[135px]">
                  {console.log(getFlagByCode(toCurrency))}
                  <CountryFlag isoCode={getFlagByCode(toCurrency).toLowerCase().toString()} size={14} />
                </View>
                </View>
           </View>  
        </View>
       
        <View style={{ flexDirection:"row", justifyContent:"center", alignItems: 'center', marginBottom:150,}}>
          <Picker style={{  flex: 1, height: 50, marginHorizontal: 10,  }}
            selectedValue={fromCurrency}
            onValueChange={(itemValue) => setFromCurrency(itemValue)}>
              {currencies.map((currency, index) => (
                  <Picker.Item key={index} label={currency} value={currency} />
              ))}

          </Picker>

          <Picker style={{ flex: 1, height: 50,marginHorizontal: 10,
            }}
            selectedValue={toCurrency}
            onValueChange={(itemValue) => setToCurrency(itemValue)}>
            {currencies.map((currency, index) => (
              <Picker.Item key={index} label={currency} value={currency} />
            ))}
          </Picker>
        </View>

          <Text style={{ fontSize: 25, fontWeight: 'bold', marginTop:30, color:'#089141'}}>
            {amount}  {fromCurrency}  =  {convertCurrency()}  {toCurrency}
          </Text>
     </View>
     </SafeAreaView>
     </>
  )
}

export default ConvertBtwnCurrencies;