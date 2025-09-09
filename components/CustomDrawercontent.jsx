import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { DrawerContentScrollView, DrawerItem, DrawerItemList, ScrollView } from "@react-navigation/drawer";
import { router, useRouter } from "expo-router";
import { icons, images } from '../constants'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { signOut } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";
import FeatherIcon from 'react-native-vector-icons/Feather';

export default function CustomDrawerContent(props) {
    const route = useRouter();
    const { user, setUser, setIsLoggedIn } = useGlobalContext();
    const { bottom } = useSafeAreaInsets();

    const logout = async () => {
        await signOut();
        setUser(null);
        setIsLoggedIn(false);
        router.replace("(auth)/sign-in");
      };
    

    return (
        <View className="flex-1">
            <DrawerContentScrollView 
            {...props} 
            scrollEnabled={false}
            contentContainerStyle={{backgroundColor: ' #ACE1AF', paddingTop: 70}}
            >

                <View className="mb-5 ml-3.5">
                    <Image 
                        className="w-[80px] h-[80px] rounded-[50px] self-start " 
                        source={images.profile_picture} /> 
                    <Text className="pt-5 font-psemibold">
                    {user?.firstName 
                        ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase()
                        : 'First name'}
                        {' '}
                        {user?.lastName 
                            ? user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1).toLowerCase()
                        : 'Last name'}
                    </Text>
                </View>
                <View 
                    className="bg-white pt-2.5">
                    <DrawerItemList {...props}/>
                    <DrawerItem label={''} onPress={() => route.replace('(drawer)/(auth)/sign-in')} />
                </View>
                
                <TouchableOpacity 
                    onPress={() => router.navigate('(drawer)/(tabs)/settings/profile')} 
                    className="flex-row ml-4 -mt-[84px] bg-white max-w-full">
                    <Image 
                        source={icons.profile_} 
                        resizeMode='contain'
                        className="w-[27px] h-[27px]"
                        />                   
                    <Text className="text-[20px] font-pregular ml-4 text-gray-500">Profile</Text>
                </TouchableOpacity>
                

            </DrawerContentScrollView>

            <View className="" 
                style={{ 
                    borderRadius: 20, 
                    borderTopColor: "#F5F5F5", 
                    borderTopWidth: 1.5, 
                    padding: 20, 
                    paddingBottom: 20 + bottom
                    }}>
                       
                {/* <TouchableOpacity onPress={logout} className="flex-row items-center -ml-6 mb-4">
                    <FeatherIcon
                        color="#2b64e3"
                        name="share-2"
                        style={{
                            alignSelf: 'left',
                            marginLeft: 30
                            
                        }}
                        size={28} />                    
                    <Text className=" text-[20px] font-pregular ml-3">Share with a friend</Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={logout} className="flex-row items-center -ml-6  ">
                    <FeatherIcon
                        color="#2b64e3"
                        name="log-out"
                        style={{
                            alignSelf: 'left',
                            marginLeft: 30
                        }}
                        size={30} />                     
                    <Text className=" text-[20px] font-pregular ml-3">Log Out</Text>
                </TouchableOpacity>
            </View>
        </View>
       
    )
}

const styles = StyleSheet.create({
     gridButtonContainer: {
    flexBasis: '25%',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridIcon: {
    fontSize: 30,
    color: 'white',
  },
  gridLabel: {
    fontSize: 14,
    paddingTop: 10,
    color: '#333',
  },
})