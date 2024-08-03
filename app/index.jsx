import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView, Image, ImageBackground, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import { images } from '../constants'
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalContext } from '../context/GlobalProvider';
const { height } = Dimensions.get("window");

export default function App() {
  const {isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) return <Redirect href="/home" />

  return (
    <>
        {/* <LinearGradient
        // Background Linear Gradient
        colors={['rgba(255,255,255,255)', 'transparent']}
        start={[0, 0]}
        end={[1,1]}
        className="absolute left-0 right-0 top-0 h-[100%]"
      /> */}
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
                containerStyles='w-full'
                />
              </View> 
          </ScrollView>
      </SafeAreaView>
      </>
 );
}
    // <SafeAreaView>
    // <View>
    // <ImageBackground
    //       style={{
    //         height: height / 2.5,
    //       }}
    //       resizeMode="contain"
    //       source={images.welcome}
    //     />
    //     <View
    //       style={{
    //         paddingHorizontal: Spacing * 4,
    //         paddingTop: Spacing * 4,
    //       }}
    //     >
    //       <Text
    //         style={{
    //           fontSize: FontSize.xxLarge,
    //           color: Colors.primary,
    //           fontFamily: Font["poppins-bold"],
    //           textAlign: "center",
    //         }}
    //       >
    //         Expense {'\n'}Tracker
    //       </Text>

    //       <Text
    //         style={{
    //           fontSize: FontSize.small,
    //           color: Colors.text,
    //           fontFamily: Font["poppins-regular"],
    //           textAlign: "center",
    //           marginTop: Spacing * 2,
    //         }}
    //       >
    //         Explore all the existing job roles based or your interest and study
    //         major
    //       </Text>
    //     </View>
    //     <View
    //       style={{
    //         paddingHorizontal: Spacing * 2,
    //         paddingTop: Spacing * 6,
    //         flexDirection: "row",
    //       }}
    //     >
    //       <TouchableOpacity
    //         onPress={() => navigate("Login")}
    //         style={{
    //           backgroundColor: Colors.primary,
    //           paddingVertical: Spacing * 1.5,
    //           paddingHorizontal: Spacing * 2,
    //           width: "48%",
    //           borderRadius: Spacing,
    //           shadowColor: Colors.primary,
    //           shadowOffset: {
    //             width: 0,
    //             height: Spacing,
    //           },
    //           shadowOpacity: 0.3,
    //           shadowRadius: Spacing,
    //         }}
    //       >
    //         <Text
    //           style={{
    //             fontFamily: Font["poppins-bold"],
    //             color: Colors.onPrimary,
    //             fontSize: FontSize.large,
    //             textAlign: "center",
    //           }}
    //         >
    //           Login
    //         </Text>
    //       </TouchableOpacity>

    //       <TouchableOpacity
    //         onPress={() => navigate("Register")}
    //         style={{
    //           paddingVertical: Spacing * 1.5,
    //           paddingHorizontal: Spacing * 2,
    //           width: "48%",
    //           borderRadius: Spacing,
    //         }}
    //       >
    //         <Text
    //           style={{
    //             fontFamily: Font["poppins-bold"],
    //             color: Colors.text,
    //             fontSize: FontSize.large,
    //             textAlign: "center",
    //           }}
    //         >
    //           Register
    //         </Text>
    //       </TouchableOpacity>
    //     </View>
    //   </View>
    // </SafeAreaView>
 

    {/* <StatusBar />
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
    </SafeAreaView> */}





