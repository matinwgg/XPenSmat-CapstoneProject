import { SafeAreaView, Text, View, Image, TouchableOpacity} from 'react-native'
import React, {useEffect, useState} from 'react'
import { Link, router } from 'expo-router'
import { Picker } from '@react-native-picker/picker';
import { icons } from '../../constants';
import TextField from '../../components/TextField';

export default function ConvertBtwnCurrencies() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('GHS');
  const [exchangeRate, setExchangeRate] = useState('0');
  const [amount, setAmount] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [error, setError] = useState(false)

  const convertCurrency = () => {
    const result = (amount * exchangeRate).toFixed(2)
      return result;
  };

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
    <SafeAreaView className="flex-1 -mt-8" >
      <View className='mt-[60px] ml-5'>
          <TouchableOpacity onPress={() => router.push("/home")} >
            <Image source={icons.left_back} resizeMode='contain' className="w-8 h-8"/>
          </TouchableOpacity>
        </View>
    <View style={{ flex:1, justifyContent: "center", alignItems: 'center', marginTop: -160}}>
      
      {/* <Image 
      source={icons.xchange} 
      style={{
        maxWidth:200,
        maxHeight:200,
        marginBottom: 20,
        objectFit: 'fill'
      }}
      /> */}
        <Text className="text-[#1F41BB] font-mbold text-4xl">Currency Converter</Text>
        {/* <Text className="text-md mb-5 font-pregular">Check live rates</Text> */} 


        <View className="flex-row mx-10 mt-3">
          <View>
            <Text className="font-pbold text-xl ml-3">Amount</Text>
            <TextField 
                  containerStyle="w-40 rounded-xl"
                  value={amount}
                  placeholder={"Enter Amount"}
                  handleTextChange={setAmount}
                  keybsType='numeric'
                  currency={fromCurrency}
              />
          </View>     
            <View>   
              <Text className="font-pbold text-xl ml-2">Converted amount</Text>
              <TextField 
                containerStyle="w-40 rounded-xl"
                value={convertCurrency()}
                placeholder={""}
                editable={false}
                //handleTextChange={setAmount}
                keybsType='numeric'
                currency={toCurrency}

            />
           </View>  
        </View>
       
        <View style={{ flexDirection:"row", justifyContent:"center", alignItems: 'center', marginBottom:150,}}>
          <Picker style={{ flex: 1, height: 50, marginHorizontal: 10,  }}
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
  )
}