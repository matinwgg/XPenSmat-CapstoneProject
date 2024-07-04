import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView, Image } from 'react-native';
import { Redirect, router } from 'expo-router';
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import { images } from '../constants'
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalContext } from '../context/GlobalProvider';


export default function App() {
  const {isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) return <Redirect href="/home" />
  return (
    <>
    <LinearGradient
        // Background Linear Gradient
        colors={['rgba(33,136,70,99)', 'transparent']}
        start={[0, 0]}
        end={[1,1]}
        className="absolute left-0 right-0 top-0 h-[100%]"
      />
    <SafeAreaView className="flex-1 justify-center mx-[5%] items-center">
       <ScrollView contentContainerStyle={{ height: '100%'}}>
        <View>
            <Image 
              source={images.welcome} // replace with the actual image URL
               className="w-[300px] h-[300px] mt-20"
               resizeMode='contain'
            />  
          <View>
            <Text className="text-5xl text-black font-pextrabold text-left mt-5 pt-5">Expense {'\n'}Tracker</Text>
          </View>
          <Text className="text-sm font-pmedium text-black text-left">Track Expenses, Manage Budget Effectively</Text>
           
           <CustomButton 
              title="Get started" 
              handlePress={() => router.push('/sign-in')}
              otherStyles="mt-[90px]"
               />
            </View> 
        </ScrollView>
    </SafeAreaView>
    </>
  );
}




